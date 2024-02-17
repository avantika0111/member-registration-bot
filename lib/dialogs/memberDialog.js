"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberDialog = void 0;
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
const MemberInfo_1 = require("../MemberInfo");
const INTRO_PROMPT = "INTRO_PROMPT";
const CHOICE_PROMPT = "CHOICE_PROMPT";
const CONFIRM_PROMPT = "CONFIRM_PROMPT";
const ID_PROMPT = "ID_PROMPT";
const NAME_PROMPT = "NAME_PROMPT";
const NUMBER_PROMPT = "NUMBER_PROMPT";
const MEMBER_INFO = "MEMBER_INFO";
const WATERFALL_DIALOG = "WATERFALL_DIALOG";
class MemberDialog extends botbuilder_dialogs_1.ComponentDialog {
    constructor(userState) {
        super("memberDialog");
        this.userState = userState;
        this.MemberInfo = userState.createProperty(MEMBER_INFO);
        this.addDialog(new botbuilder_dialogs_1.TextPrompt(INTRO_PROMPT));
        this.addDialog(new botbuilder_dialogs_1.TextPrompt(NAME_PROMPT));
        this.addDialog(new botbuilder_dialogs_1.NumberPrompt(NUMBER_PROMPT, this.agePromptValidator));
        this.addDialog(new botbuilder_dialogs_1.ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new botbuilder_dialogs_1.ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new botbuilder_dialogs_1.TextPrompt(ID_PROMPT));
        this.addDialog(new botbuilder_dialogs_1.WaterfallDialog(WATERFALL_DIALOG, [
            // this.introStep.bind(this),
            this.roleStep.bind(this),
            this.idStep.bind(this),
            this.idConfirmStep.bind(this),
            this.nameStep.bind(this),
            this.nameConfirmStep.bind(this),
            this.ageStep.bind(this),
            this.confirmStep.bind(this),
            this.summaryStep.bind(this),
        ]));
        this.initialDialogId = WATERFALL_DIALOG;
    }
    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const diaogSet = new botbuilder_dialogs_1.DialogSet(accessor);
        diaogSet.add(this);
        const dialogContext = await diaogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === botbuilder_dialogs_1.DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }
    async roleStep(stepContext) {
        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is a Prompt Dialog.
        // Running a prompt here means the next WaterfallStep will be run when the users response is received.
        await stepContext.context.sendActivity("Welcome to the Member Registration Bot!");
        await stepContext.context.sendActivity("I will ask you a few questions to get started. Let's start with your role.");
        return await stepContext.prompt(CHOICE_PROMPT, {
            choices: botbuilder_dialogs_1.ChoiceFactory.toChoices([
                "Software Engineer",
                "Project Manager",
                "Designer",
                "Architect",
                "Product Owner",
            ]),
            prompt: "Please choose your role.",
        });
    }
    async idStep(stepContext) {
        stepContext.options.role = stepContext.result.value;
        return await stepContext.prompt(ID_PROMPT, "Please enter your Member ID.");
    }
    async idConfirmStep(stepContext) {
        stepContext.options.id = stepContext.result;
        const msg = stepContext.options.id === ""
            ? "No ID given."
            : `You have entered ${stepContext.options.id}.`;
        // We can send messages to the user at any point in the WaterfallStep.
        await stepContext.context.sendActivity(msg);
        // WaterfallStep always finishes with the end of the Waterfall or with another dialog, here it is a Prompt Dialog.
        return await stepContext.prompt(CONFIRM_PROMPT, "Is that right?", [
            "yes",
            "no",
        ]);
    }
    async nameStep(stepContext) {
        // if (stepContext.result === true) {
        //   const promptOptions = {
        //     prompt: "Thanks. Please enter your name.",
        //   };
        //   return await stepContext.prompt(NAME_PROMPT, promptOptions);
        // } else {
        //   // User said "no" so we will display a message and ask for the name again.
        //   return await stepContext.prompt(
        //     NAME_PROMPT,
        //     "No Problem. Please enter your name."
        //   );
        // }
        if (stepContext.result === true) {
            await stepContext.context.sendActivity("Thanks!");
        }
        else {
            await stepContext.context.sendActivity("No Problem!");
        }
        return await stepContext.prompt(NAME_PROMPT, "Please enter your name.");
    }
    async nameConfirmStep(stepContext) {
        stepContext.options.name = stepContext.result;
        // We can send messages to the user at any point in the WaterfallStep.
        await stepContext.context.sendActivity(`Thanks ${stepContext.result}.`);
        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is a Prompt Dialog.
        return await stepContext.prompt(CONFIRM_PROMPT, "Do you want to give your age?", ["yes", "no"]);
    }
    async ageStep(stepContext) {
        if (stepContext.result === true) {
            // User said "yes" so we will be prompting for the age.
            // WaterfallStep always finishes with the end of the Waterfall or with another dialog, here it is a Prompt Dialog.
            const promptOptions = {
                prompt: "Please enter your age.",
                retryPrompt: "The value entered must be greater than 0 and less than 150.",
            };
            return await stepContext.prompt(NUMBER_PROMPT, promptOptions);
        }
        else {
            // User said "no" so we will skip the next step. Give -1 as the age.
            return await stepContext.next(-1);
        }
    }
    async confirmStep(stepContext) {
        stepContext.options.age = stepContext.result;
        const msg = stepContext.options.age === -1
            ? "No age given."
            : `I have your age as ${stepContext.options.age}.`;
        // We can send messages to the user at any point in the WaterfallStep.
        await stepContext.context.sendActivity(msg);
        // WaterfallStep always finishes with the end of the Waterfall or with another dialog, here it is a Prompt Dialog.
        return await stepContext.prompt(CONFIRM_PROMPT, {
            prompt: "Is this okay?",
        });
    }
    async summaryStep(stepContext) {
        if (stepContext.result) {
            // Get the current profile object from user state.
            const memberInfo = await this.MemberInfo.get(stepContext.context, new MemberInfo_1.MemberInfo());
            const stepContextOptions = stepContext.options;
            memberInfo.role = stepContextOptions.role;
            memberInfo.id = stepContextOptions.id;
            memberInfo.name = stepContextOptions.name;
            memberInfo.age = stepContextOptions.age;
            let msg = `I have your role as ${memberInfo.role} and your member ID as ${memberInfo.id} and your name as ${memberInfo.name}.`;
            if (memberInfo.age !== -1) {
                msg += ` And age as ${memberInfo.age}.`;
            }
            await stepContext.context.sendActivity(msg);
        }
        else {
            await stepContext.context.sendActivity("Thanks. Your profile will not be kept.");
        }
        // WaterfallStep always finishes with the end of the Waterfall or with another dialog, here it is the end.
        return await stepContext.endDialog();
    }
    async agePromptValidator(prompt) {
        // This condition is our validation rule. You can also change the value at this point.
        return (prompt.recognized.succeeded &&
            prompt.recognized.value > 0 &&
            prompt.recognized.value < 150);
    }
}
exports.MemberDialog = MemberDialog;
//# sourceMappingURL=memberDialog.js.map
import { StatePropertyAccessor, TurnContext, UserState } from "botbuilder";
import { ComponentDialog } from "botbuilder-dialogs";
export declare class MemberDialog extends ComponentDialog {
    private userState;
    private MemberInfo;
    constructor(userState: UserState);
    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    run(turnContext: TurnContext, accessor: StatePropertyAccessor): Promise<void>;
    private roleStep;
    private idStep;
    private idConfirmStep;
    private nameStep;
    private nameConfirmStep;
    private ageStep;
    private confirmStep;
    private summaryStep;
    private agePromptValidator;
}

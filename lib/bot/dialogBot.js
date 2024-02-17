"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogBot = void 0;
const botbuilder_1 = require("botbuilder");
class DialogBot extends botbuilder_1.ActivityHandler {
    /**
     *
     * @param {ConversationState} conversationState
     * @param {UserState} userState
     * @param {Dialog} dialog
     */
    constructor(conversationState, userState, dialog) {
        super();
        if (!conversationState)
            throw new Error('ConversationState is required');
        if (!userState)
            throw new Error('UserState is required');
        if (!dialog)
            throw new Error('Dialog is required');
        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.dialogState = userState.createProperty('DialogState');
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (const element of membersAdded) {
                if (element.id !== context.activity.recipient.id) {
                    await this.dialog.run(context, this.dialogState);
                }
            }
            await next();
        });
        this.onMessage(async (context, next) => {
            console.log('Running dialog with Message Activity.');
            // Run the Dialog with the new message Activity.
            await this.dialog.run(context, this.dialogState);
            await next();
        });
        this.onDialog(async (context, next) => {
            // Save any state changes. The load happened during the execution of the Dialog.
            await this.conversationState.saveChanges(context, false);
            await this.userState.saveChanges(context, false);
            await next();
        });
    }
}
exports.DialogBot = DialogBot;
//# sourceMappingURL=dialogBot.js.map
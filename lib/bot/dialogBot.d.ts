import { ActivityHandler, BotState, ConversationState } from 'botbuilder';
import { Dialog } from 'botbuilder-dialogs';
export declare class DialogBot extends ActivityHandler {
    private conversationState;
    private userState;
    private dialog;
    private dialogState;
    /**
     *
     * @param {ConversationState} conversationState
     * @param {UserState} userState
     * @param {Dialog} dialog
     */
    constructor(conversationState: ConversationState, userState: BotState, dialog: Dialog);
}

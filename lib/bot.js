"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyBot = void 0;
const botbuilder_1 = require("botbuilder");
class EmptyBot extends botbuilder_1.ActivityHandler {
    constructor() {
        super();
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity('Hello world!');
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}
exports.EmptyBot = EmptyBot;
//# sourceMappingURL=bot.js.map
'use strict';
const dotenv = require('dotenv');
const ConversationV1 = require('watson-developer-cloud/conversation/v1');

class Conversation {
    constructor() {
        dotenv.config();
        this.conversationService = new ConversationV1({
            username: process.env.CONVERSATION_USERNAME,
            password: process.env.CONVERSATION_PASSWORD,
            version_date: '2017-04-21'
        });
        this.conversationWorkspaceId = process.env.CONVERSATION_WORKSPACE_ID;
    }

    processMessage(message, conversationContext) {
        let conversationResponse = null;
        return this.sendRequestToWatsonConversation(message, conversationContext)
            .then((response) => {
                conversationResponse = response;
                return this.handleResponseFromWatsonConversation(conversationResponse);
            })
            .then((reply) => {
                return Promise.resolve(reply);
            })
            .catch((error) => {
                console.log(`Error: ${JSON.stringify(error,null,2)}`);
                return Promise.resolve({});
            });
    }

    sendRequestToWatsonConversation(message, conversationContext) {
        return new Promise((resolve, reject) => {
            var conversationRequest = {
                input: {text: message},
                context: conversationContext,
                workspace_id: this.conversationWorkspaceId,
            };
            this.conversationService.message(conversationRequest, (error, response) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(response);
                }
            });
        });
    }
    
    handleResponseFromWatsonConversation(conversationResponse) {
        const action = conversationResponse.context.action;
        if (action == "xxx") {
             return this.handleXXXMessage(conversationResponse);
        }
        else if (action == "yyy") {
             return this.handleYYYMessage(conversationResponse);
        }
        else {
            return this.handleDefaultMessage(conversationResponse);
        }
    }

    handleDefaultMessage(conversationResponse) {
        return Promise.resolve({response: conversationResponse.output.text, conversationContext: conversationResponse.context});
    }

    handleXXXMessage(conversationResponse) {
        let reply = 'TBD';
        return Promise.resolve(reply);
    }

    handleYYYMessage(conversationResponse) {
        let reply = 'TBD';
        return Promise.resolve(reply);
    }
  
}

module.exports = Conversation;
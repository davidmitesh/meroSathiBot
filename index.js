const _ = require("lodash");
const Wit = require("node-wit").Wit;
const log = require("node-wit").log;
const wit = new Wit({
  accessToken: process.env.WIT_TOKEN,
  logger: new log.Logger(log.INFO)
});
let index = 0;
let questionCheck=true;
score_sheet = { intro_score: [], questions_boolean: [] };
intro_questions = [
  "So, How old are you?",
  "Can I know your gender my friend?",
  "Where are you residing at present?",
  "Do you have a history of psychiatric illness in the past?",
  "Have you ever attempted a suicide in past?",
  "Do you use alcohol or any other drugs on regular basis?",
  "Is there a history of psychiatric illness or suicide in your family?"
];
intro_question_answers = {};
results={};
total_questions = [ "So, How old are you?",
"Can I know your gender my friend?",
"Where are you residing at present?",
"Do you have a history of psychiatric illness in the past?",
"Have you ever attempted a suicide in past?",
"Do you use alcohol or any other drugs on regular basis?",
"Is there a history of psychiatric illness or suicide in your family?",
  "Do you have little interest or no pleasure in doing things that you enjoyed before?",
  "Have you been continuously feeling sad or depressed?",
  "Do you have problems in sleep (sleeping too little or sleeping too much)?",
  "Have you been feeling tired or having little energy throughout the day?",
  "Do you have poor appetite or have problems of overeating?",
  "Do you feel guilty about yourself or feel that you are worthless?",
  "Have you been having thoughts that you would be better off dead or of hurting yourself in some way or thoughts of suicide?",
  "Do you have trouble in attention and concentration while doing day to day activities of life?",
  "Have you been anxious, restless or having multiple worries and doubts in mind more than usual?",
  "Have your level of confidence decreased than before?",
  "Do you hear voices in your ears not heard to others?",
  "Have you become more suspicious to people than usual or feel insecure for yourself or feel people are trying to harm you or your family?",
  "Do you have to wash your hands repeatedly, check something repeatedly or have a repeated thought in mind?",
  "Do you feel happier or angrier throughout the day than your usual self?",
  "Do you use alcohol or other substance that is causing problem in your daily life?"
];
var intro = true;
async function handleNLP(context) {
  const result = await wit
    .message(context.event.text)
    .then(({ entities, intents, traits }) => {
      // You can customize your response using these
      // console.log(intents);
      console.log(entities);

      // console.log(traits);
      // For now, let's reply with another automatic message
      // var response = {
      //   intent: entities.intent[0].value,
      //   name: entities.contact[0].value
      // };
      // console.log(response);
      return entities;
    })
    .catch(err => {
      console.error("Oops! Got an error from Wit: ", err.stack || err);
    });
  return result;
}
async function sendButton(context) {
  var c = index;
  index++;
  if (c == 1) {
    return await context.sendButtonTemplate(total_questions[c], [
      {
        type: "postback",
        title: "male",
        payload: "Male"
      },
      {
        type: "postback",
        title: "female",
        payload: "Female"
      },
      {
        type: "postback",
        title: "other",
        payload: "Other"
      }
    ]);
  }
  // if (c > 6) {
  //   intro = false;
  //   index = 0;
  // }
  // if (c <= 6 && intro == true) {
  //   questions = intro_questions;
  // } else {
  //   questions = total_questions;
  // }
  if (c < 3) {
    return await context.sendText(total_questions[c]);
  } else {
    return await context.sendButtonTemplate(total_questions[c], [
      {
        type: "postback",
        title: "Yes",
        payload: "Yes"
      },
      {
        type: "postback",
        title: "No",
        payload: "No"
      }
    ]);
  }
}

//This is the function to return the last question that decides whether the patient should be sent to
//psychiatrist or not.
const last_question="If you have been bothered by any of the problems listed above,\
 how difficult have these problems made it for you in your daily life?";
async function sendLastQuestionButton(context) {
    return await context.sendButtonTemplate(last_question, [
      {
        type: "postback",
        title: "Not Difficult at all.",
        payload: "first"
      },
      {
        type: "postback",
        title: "Somewhat Difficult",
        payload: "second"
      },
      {
        type: "postback",
        title: "Very  Difficult",
        payload: "third"
      }
    ]);
}

module.exports = async function App(context) {
  if (context.event.payload == "GET_STARTED") {
    return await context.sendText(
      "Hey new mate, I am Kaila Kancho. What can I call you?"
    );
  }
  if (_.includes(["Male", "Female", "Other"], context.event.payload)) {
    intro_question_answers.gender = context.event.payload;
    return sendButton;
  }
  // This is to handle the cases of postback requests where the answer is either "yes"/'no'.
  if ((_.includes(["Yes", "No"], context.event.payload)) && questionCheck) {
    

    // if (index <=)
    
    switch(index-1){
      case -1:
        break;
      case 0:
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        intro_question_answers.history_pyschiatric_illness=context.event.payload;
        if (context.event.payload === 'Yes'){
          results.intro=true;
        }
        break;
      case 4:
        intro_question_answers.past_suicide_attempt=context.event.payload;
        if (context.event.payload === 'Yes'){
          results.intro=true;
        }
        
        break;
      case 5:
        intro_question_answers.alcohol_drug_use=context.event.payload;
        if (context.event.payload === 'Yes'){
          results.intro=true;
        }
        
        break;
      case 6:
        intro_question_answers.family_pyschiatric_history=context.event.payload;
        if (context.event.payload === 'Yes'){
          results.intro=true;
        }
        
        break;
      // case 7:
      //   
      default:
        intro_question_answers[total_questions[index-1]]=context.event.payload;
        if (context.event.payload === 'Yes'){
          results.questions=true;
        }
        
        console.log("index is ",index)
        console.log("default case is printed");



    }

    console.log(intro_question_answers);
    if (index-1 == 21){
      questionCheck=false;
      return sendLastQuestionButton;
    } else {
      return sendButton;

    }
    

  }

  // console.log(handleNLP(context));

  //checking the answer of the last decision question.
  if (_.includes(["first","second","third"], context.event.payload)){
    switch(context.event.payload){
      case "first":
        return await context.sendText(
          "After evaluating your screening, I find you completely normal.There is no need of visiting a psychiatrist."
        );
        break;
      case "second":
        return await context.sendText(
          
          `${intro_question_answers.name},it is always better to stop problems before they turn into a disease. You may see a psychiatrist`
        );
        break;
      default:
        return await context.sendText(
          
          `${intro_question_answers.name}, I know you are going through a hard time. But let me tell you can be easily cured by seeing a psychiatrist. I suggest you must see one.`
        );
        break;

    }
  }

  if (!context.event.isPayload) {
    let entities = await handleNLP(context);

    if (entities.intent[0].value == "name_select" ) {
      intro_question_answers.name = entities.contact[0].value;
      await context.sendText(
        `hello ${entities.contact[0].value}, I am an AI bot trained by professional pyschiatrists to help the people in need. So, you can open up with me without the fear of being judged.`
      );
      return await context.sendButtonTemplate(`Are you ready to get started?`, [
        {
          type: "postback",
          title: "Yes",
          payload: "Yes"
        },
        {
          type: "postback",
          title: "No",
          payload: "No"
        }
      ]);
    }
    if (entities.intent[0].value == "location_select") {
      await context.sendText(
        `${entities.location[0].value} is a lovely a place. I wish to travel there sometimes.`
      );
      intro_question_answers.location = entities.location[0].value;
      console.log(intro_question_answers);
      return sendButton;
    }

    if (entities.intent[0].value == "age_select" ) {
      intro_question_answers.age = entities.age_of_person[0].value ;
      console.log(intro_question_answers)
      return sendButton;
    }
  }

  // console.log(response);

  return sendButton;

  // return handleNLP;
};

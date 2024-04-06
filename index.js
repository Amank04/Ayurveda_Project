import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import env from "dotenv";
import uniqid from "uniqid";

const app = express();
env.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));
app.set('view engine', 'ejs');

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.get('/', (req, res) => {

  res.render("index.ejs");
})


app.get('/questions', (req, res) => {
  res.render('questions', { nextPage: 1 });
})

app.get('/history', (req, res) => {
  res.render('searchRefID');
})

//Array containing answer of each question.
var ansArray;

// Function to add values to array if it's not already present
function addValuesToArray(obj, arr) {
  Object.values(obj).forEach(value => {
    arr.push(value);
  });
}

// Route handler to render the questions.ejs file
app.post('/submit-responses', async (req, res) => {
  // Parse the page number from the query parameter, default to 1 if not provided
  const page = parseInt(req.query.page);
  // console.log(req.body);
  // console.log(page);
  // Determine the section based on the page number
  // Calculate the start and end index of questions for the current section



  let startIndex, endIndex;
  let subsetOfQuestions;
  let section;
  if (page == 1) {
    // console.log(req.body);
    section = 'Physical appearance and health.';
    startIndex = 0, endIndex = 14;
    subsetOfQuestions = questions.slice(startIndex, endIndex + 1);
    // Call the function with the userObject and existingArray

    ansArray = [];
    addValuesToArray(req.body, ansArray);

    res.render('questions', { Questions: subsetOfQuestions, section, nextPage: page + 1 });
  } else if (page == 2) {
    // console.log(req.body);
    section = 'Sleep pattern and energy levels';
    startIndex = 15, endIndex = 16;
    subsetOfQuestions = questions.slice(startIndex, endIndex + 1);

    // Call the function with the userObject and existingArray
    ansArray.length = 19;
    addValuesToArray(req.body, ansArray);

    res.render('questions', { Questions: subsetOfQuestions, section, nextPage: page + 1 });
  } else if (page == 3) {
    // console.log(req.body);
    section = 'Diet, appetite and type of food you prefer';
    startIndex = 17, endIndex = 21;
    subsetOfQuestions = questions.slice(startIndex, endIndex + 1);

    // Call the function with the userObject and existingArray
    ansArray.length = 21;
    addValuesToArray(req.body, ansArray);

    res.render('questions', { Questions: subsetOfQuestions, section, nextPage: page + 1 });
  } else if (page == 4) {
    // console.log(req.body);
    section = 'Personality, communication skills and social behavior';
    startIndex = 22, endIndex = 28;
    subsetOfQuestions = questions.slice(startIndex, endIndex + 1);

    // Call the function with the userObject and existingArray
    ansArray.length = 26;
    addValuesToArray(req.body, ansArray);

    res.render('questions', { Questions: subsetOfQuestions, section, nextPage: page + 1 });
  }
  else if (page == 5) {
    // console.log(req.body);
    section = 'Preferred type of weather';
    startIndex = 29, endIndex = 29;
    subsetOfQuestions = questions.slice(startIndex, endIndex + 1);

    // Call the function with the userObject and existingArray
    ansArray.length = 33;
    addValuesToArray(req.body, ansArray);

    res.render('questions', { Questions: subsetOfQuestions, section, nextPage: page + 1 });
  } else if (page == 6) {
    // console.log(req.body);

    // Call the function with the userObject and existingArray
    ansArray.length = 34;
    addValuesToArray(req.body, ansArray);

    // Flatten the responses array and filter out non-option values
    const options = ansArray.flat().filter(item => ['Vata', 'Pitta', 'Kapha'].includes(item));

    // Count the occurrences of each option
    const counts = options.reduce((acc, option) => {
      acc[option] = (acc[option] || 0) + 1;
      return acc;
    }, {});

    // Sort the options by their counts in descending order
    const sortedOptions = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);

    // Extract the most used and second most used options
    const mostUsed = sortedOptions[0];
    const secondMostUsed = sortedOptions[1];

    // Store the most used and second most used options in another array
    const result = [mostUsed, secondMostUsed];
    ansArray.length = 4;
    ansArray.push(mostUsed);
    ansArray.push(secondMostUsed);


    section = 'Questions for data collection.';
    startIndex = 30, endIndex = 39;
    subsetOfQuestions = questions.slice(startIndex, endIndex + 1);

    res.render('extraQues', { Questions: subsetOfQuestions, section, nextPage: page + 1 });


  } else {
    console.log("Extra questions blog completed.")
    if (Object.keys(req.body).length < 10) {
      section = 'Questions for data collection.';
      startIndex = 30, endIndex = 39;
      subsetOfQuestions = questions.slice(startIndex, endIndex + 1);

      res.render('extraQues', { Questions: subsetOfQuestions, section, nextPage: page, message: "Please select atleast one option of each question." });
    } else {


      // Call the function with the userObject and existingArray
      ansArray.length = 6;
      addValuesToArray(req.body, ansArray);

      //Function to store MSQ starts.
      function flattenStringArray(arr) {
        return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenStringArray(val)) : acc.concat(val), []);
      }

      // const nestedStringArray = ["1", "2", ["3", "4", "5"], "6"];
      const flattenedStringArray = flattenStringArray(ansArray);
      // console.log(flattenedStringArray); // Output: ["1", "2", "345", "6"]

      //Function to store MSQ ends.

      try {
        let result = await db.query("INSERT INTO prakirtiinfo (name, age, gender, birthplace, prakirtimajor, prakirtiminor, ques01, ques02, ques03, ques04, ques05, ques06, ques07, ques08, ques09, ques10, referenceid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *", [
          ansArray[0], ansArray[1], ansArray[2], ansArray[3], ansArray[4], ansArray[5], ansArray[6], ansArray[7], ansArray[8], ansArray[9], ansArray[10], ansArray[11], ansArray[12], ansArray[13], ansArray[14], ansArray[15], uniqid()
        ]);

        const referenceid = result.rows[0].referenceid;
        const name = result.rows[0].name;
        const majorprakirti = result.rows[0].prakirtimajor;
        const minorprakirti = result.rows[0].prakirtiminor;
        res.render("submitform.ejs", { ReferenceID: referenceid, name: name, prakirtiMajor: majorprakirti, prakirtiMinor: minorprakirti });
      } catch (error) {
        console.error("Error inserting data: ", error);
      }

    }
  }
  // console.log(ansArray);

});

app.post("/search",async (req,res) => {
  const referenceid = req.body.referenceId;

  try {
  
    let result = await db.query("SELECT * from prakirtiinfo WHERE referenceid = $1",[referenceid]);

    if (result.rows.length > 0) {
        const name = result.rows[0].name;
        const minorprakirti = result.rows[0].prakirtiminor;
        const majorprakirti = result.rows[0].prakirtimajor;
        res.render("searchRefID.ejs", { ReferenceID: referenceid, name: name, prakirtiMajor: majorprakirti, prakirtiMinor: minorprakirti });
    } else {
        // If no record found with the provided reference ID
        res.render("searchRefID.ejs", { errorMessage: "Reference ID not found" });
    }
} catch (error) {
    // console.error("Error searching referenceID: ", error);
    // Handle other errors such as database connection issues
    res.render("searchRefID.ejs", { errorMessage: "An error occurred while processing your request" });
}

})


const server = app.listen(3000, () => {
  console.log(`The application started on port ${server.address().port}`);
});


const questions = [
  {
    id: 1,
    text: "How does your eyes look like?",
    options: ["Almond or oval shaped, small sized eyes", "Sharp-edged or penetrating, medium sized eyes", "Round, large and attractive eyes"],
  },
  {
    id: 2,
    text: "What usually your body temperature is?",
    options: ["I tend to run slightly warmer than normal", "My body temperature is generally within the normal range", "I run slightly cooler than the average body temperature. My hands and feet are often cold"],
  },
  {
    id: 3,
    text: "What do your nails look like?",
    options: ["Rough, dry and do not grow much", "They have a slightly glossy, reddish/pinkish appearance", "Long, whitish, strong, and thick nails"],
  },
  {
    id: 4,
    text: "What does your neck look like?",
    options: ["My neck is relatively thin, long and has loose tendons", "My neck is medium in size", "My neck happens to be large and thick"],
  },
  {
    id: 5,
    text: "Your lips are?",
    options: ["Dry, thin, and tend to darken", "Red, soft, and naturally moist lips", "Thick and glossy in appearance"],
  },
  {
    id: 6,
    text: "What does your tongue look like?",
    options: ["My tongue is somewhat fissured (cracked)", "My tongue has a smooth, red texture", "My tongue displays white spots"],
  },
  {
    id: 7,
    text: "Your hands are?",
    options: ["Relatively short.", "Of medium length", "Long and elegant"],
  },
  {
    id: 8,
    text: "How does your forehead look like?",
    options: ["My forehead is relatively small with wrinkles", "My forehead is medium in size with folds", "My forehead is large and broad"],
  },
  {
    id: 9,
    text: "What about your skin health?",
    options: ["My skin tends to be dry, rough and lacking moisture", "I have soft, warm skin that is often balanced", "I have soft, glossy, oily skin that can feel cool to touch."],
  },
  {
    id: 10,
    text: "What's your scalp hair situation?",
    options: ["My hair tends to be stiff, curly, and on the dry side. It can tend to be brittle", "I have scanty hair with a tendency for early baldness and/or premature greying. My hair is mostly straight.", "I am blessed with thick, shiny/glossy, long, and sometimes wavy locks."],
  },
  {
    id: 11,
    text: "What's your body hair situation?",
    options: ["I have scanty body hair", "There are few hairs, and they tend to be brownish", "I am quite hairy with dark, thick, and abundant hair."],
  },
  {
    id: 12,
    text: "How's your pulse?",
    options: ["Irregular and quick", "It is fast-paced, but the volume is less pronounced", "Slow, full-volume pulse"],
  },
  {
    id: 13,
    text: "How your body reacts to diseases?",
    options: ["I tend to be more susceptible to illness", "My resistance is moderate.", "I have a strong immune system"],
  },
  {
    id: 14,
    text: "What is your body perspiration rate?",
    options: ["I do not sweat much", "I sweat easily and sometimes have a strong body odor.", "My perspiration levels are normal and balanced"],
  },
  {
    id: 15,
    text: "What pattern do your teeth and gums display?",
    options: ["My teeth are irregular in alignment and  protruding. I have receding gums.", "I have medium-sized teeth and reddish, normal-sized gums", "I have big, white and strong teeth. I have heavy gums which are visible prominently when I smile."],
  },
  {
    id: 16,
    text: "How's your sleep pattern?",
    options: ["My sleep is often interrupted and not very restful.", "I generally have a normal sleep pattern and I can wake up easily.", "I tend to sleep excessively and deeply."],
  },
  {
    id: 17,
    text: "What is your energy type? (After waking up)",
    options: ["Bursts of energy followed by periods of fatigue.", "Moderate but steady energy throughout the day.", "Steady, enduring energy but tendency towards lethargy."],
  },
  {
    id: 18,
    text: " What are your preferred tastes?",
    options: ["I am very fond of sour, salty and sweet food items.", "I derive pleasure from cherishing food that are mainly sweet, bitter or astringent in taste.", "I relish dishes that are bitter, pungent or astringent in taste."],
  },
  {
    id: 19,
    text: "How often you get thirsty?",
    options: ["The pattern of my thirst is kind of irregular.", "I often feel thirsty and need to consume water frequently.", "I seldom(rarely) feel thirsty and can go on without water for hours."],
  },
  {
    id: 20,
    text: " How you describe your digestion?",
    options: ["I have irregular digestion and find some foods hard to digest.", "My digestion is regular and easy, but may experience heartburn or irritability when meals are missed.", "I often feel drowsy after meals, and my digestions feels heavy; slow digestion."],
  },
  {
    id: 21,
    text: "What impact do your eating habits have on your body weight?",
    options: ["I am naturally slim - it is a challenge to put on weight.", "I maintain a moderate weight - I can easily shed or gain a few pounds.", "I tend to be on the heavier side - weight piles on quickly, and shedding it is tough"],
  },
  {
    id: 22,
    text: "How you describe your appetite and hunger tolerance?",
    options: ["My appetite varies, sometimes it is quite scanty. Sometimes, I might miss a meal and do not seem to remember it either", "I have an excessive appetite and love a good meal. I would really get irritated if I miss a meal.", "I have a slow, steady appetite that does not fluctuate much. However, I do not mind missing a meal sometimes if that is deemed necessary."],
  },
  {
    id: 23,
    text: "How you describe your walking style? (when time is not a constraint and you are alone during the journey)",
    options: ["I walk very quickly with swift, purposeful movements.", "My walking pace is normal and steady.", "I have a slow and deliberate gait when walking."],
  },
  {
    id: 24,
    text: "How do you usually feel in social settings?",
    options: ["I prefer solitude(alone) over large gatherings.", "I thrive in the energy of large groups", "I feel most comfortable in intimate, small gatherings."],
  },
  {
    id: 25,
    text: "What are the the preferred activities you like to do in leisure times?",
    options: ["I love staying physically active", "I exercise to reduce stress and stay balanced.", "I enjoy leisurely like games, movies, and cards."],
  },
  {
    id: 26,
    text: "What kind of body movements do you usually find yourself doing in different situations?",
    options: ["I tend to move legs and shoulders a lot when working", "My body movements are normal and aligned with my tasks.", "I do no have many associated body movements when working."],
  },
  {
    id: 27,
    text: "How you describe your sexual desire?",
    options: ["My sexual desire is on the lower side.", "I have a moderate level of sexual desire", "I have abundant sexual desire and energy."],
  },
  {
    id: 28,
    text: "How do you usually manage your finances?",
    options: ["Tendency to spend money impulsively.", "Tendency to spend mainly on meaningful things and save wisely.", "Tendency to save more and spend cautiously"],
  },
  {
    id: 29,
    text: "What about your memory capacity and recall abilities?",
    options: ["I remember recent events well but struggle with older memories.", "My memory is sharp and quick to recall.", "I have a good long-term memory but I may tend to forget or miss immediate plans and schedules."],
  },
  {
    id: 30,
    text: "What is your preferred type of weather?",
    options: ["I cannot stand the cold - it is not for me.", "I struggle with warmth and prefer cooler temperatures.", "I am adaptable and can handle both cold and warm weather."],
  },
  //Extra questions for data collections.
  {
    id: 31,
    text: "What are your outfit choice(s) ?",
    options: ["Bold colors or statement pieces.", "Loose-fitting clothes for a sense of grounding.", "Prefer more structured clothing that provides definition."],
  },
  {
    id: 32,
    text: " In what form do you include fruits in your diet ?",
    options: ["Eaten fresh as a snack or dessert.", "Blended into smoothies or juices.", "Cooked or baked in dishes.", "Rarely include fruits in my diet."],
  },
  {
    id: 33,
    text: "How often do you consume fermented food items or beverages ?",
    options: ["Daily", "A few times a week", "Rarely", "Never"],
  },
  {
    id: 34,
    text: "How does your diet change when you're stressed or emotionally upset ?",
    options: ["I eat more, especially comfort food.", "I eat less or skip meals.", "I crave sweets or junk food.", "No significant change."],
  },
  {
    id: 35,
    text: "What's your Body Mass Index ?",
    options: ["Less than 17", "17 to 18.5", "18.5 to 25", "25 to 30", "More than 30"],
  },
  {
    id: 36,
    text: "What is your socioeconomic background ?",
    options: ["Grew up in a privileged environment with access to high-quality resources.", "Grew up in a middle-class family with comfortable living conditions", "Grew up in a working-class family with limited financial resources.", "Grew up in a poverty or hardship", "Grew up with significant wealth and privilege."],
  },
  {
    id: 37,
    text: "What is your cultural background ?",
    options: ["Grew up in a culture with a strong emphasis on family and tradition", "Grew up in a culture that values individualism and personal expression.", "Grew up in a multicultural environment with diverse influences.", "Grew up in a religious or spiritual community.", "Grew up in a secular environment."],
  },
  {
    id: 38,
    text: "Regarding the urban or rural area where you grew up...",
    options: ["Grew up in a large city (metropolitan area).", "Grew up in a suburban area.", "Grew up in a small town or village.", "Grew up in a rural area with limited access to urban amenities.", "Grew up on a farm or in a close-knit rural community."],
  },
  {
    id: 39,
    text: "The climate of the area where you grew up...",
    options: ["Tropical Monsoon (Hot & Humid)", "Subtropical (Warm Summers, Mild Winters)", "Tropical wet & Dry (Warm & Humid Summers)", "Arid (Hot & Dry)", "Himalayan (Cold & High Altitude)", "All of the above (Varied climate)"],
  },
  {
    id: 40,
    text: "What is your Blood Group ?",
    options: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
  }

];

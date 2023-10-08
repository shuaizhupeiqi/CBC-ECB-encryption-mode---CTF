/* eslint-disable prefer-const */
/* eslint-disable comma-dangle */
/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const { getHSSData } = require("./hssHelper");

admin.initializeApp();

const gmailEmail = functions.config().gmail.email0fficial;
const gmailPassword = functions.config().gmail.passwordofficial;

// Set up Nodemailer transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const detailedRecommendationTips = {
  tips: [
    {
      icon: "waterBottle",
      label: `
        Drink at least 250 ml of water every hour even 
        if you do not feel thirsty at a temperature that 
        encourages you to drink more.
      `,
      riskLevel: ["Low", "Moderate", "High", "Extreme"],
    },
    {
      icon: "spray",
      label: `Keep your skin as wet as possible with 
      a spray bottle or water-soaked cloth.`,
      riskLevel: ["High", "Extreme"],
    },
    {
      icon: "tankTop",
      label: `Wear lightweight, loose-fitting clothing preferably white.`,
      riskLevel: ["Low", "Moderate", "High", "Extreme"],
    },
    {
      icon: "fan",
      label: `Use electric fans, turn them off if the indoor temperature reaches 39°C 
      and drink more water.`,
      riskLevel: ["Low", "Moderate", "High", "Extreme"],
    },
    {
      icon: "lounger",
      label: "Rest more often, in a shaded place with natural air movement.",
      riskLevel: ["Moderate", "High", "Extreme"],
    },
    {
      icon: "noRunning",
      label: "Plan strenuous activities for when the heat stress risk is low.",
      riskLevel: ["Moderate", "High", "Extreme"],
    },
    {
      icon: "squeeze",
      label: `Soak a wet towel in cold water 
      and wrap it loosely around your head and neck.`,
      riskLevel: ["Moderate", "High", "Extreme"],
    },
    {
      icon: "fan",
      label: `Use a misting fan in a shaded well-ventilated area, if available.`,
      riskLevel: ["Moderate", "High", "Extreme"],
    },
    {
      icon: "blinds",
      label: `Using internal blinds or 
      curtains to block direct sunlight coming through windows.`,
      riskLevel: ["Low", "Moderate", "High", "Extreme"],
    },
    {
      icon: "ventilation",
      label: "Open windows only if it is hotter inside than outside.",
      riskLevel: ["Low", "Moderate", "High", "Extreme"],
    },
    {
      icon: "ac",
      label: `Use an air conditioner with the thermostat set at 27°C 
      and use an electric fan to increase the airflow over the skin.`,
      riskLevel: ["Low", "Moderate", "High", "Extreme"],
    },
    {
      icon: "evaporative",
      label: "Use an evaporative cooler if humiditv is low.",
      riskLevel: ["Low", "Moderate", "High", "Extreme"],
    },
    {
      icon: "iceCubes",
      label: `Place crushed ice cubes in a wet towel 
      and wrap loosely around your neck.`,
      riskLevel: ["Extreme"],
    },
    {
      icon: "warmWater",
      label: "Place your feet in a bucket of cold water up to your ankles.",
      riskLevel: ["Extreme"],
    },
  ],
};

/**
 *@param {Object} todayData
 *@return {Object}
 */
async function generateChartImage(todayData) {
  let xLabels = [];
  let lowData = [];
  let medData = [];
  let highData = [];
  let extremeData = [];
  let yData = [];
  // Fill the data arrays based on todayData
  for (const entry of todayData) {
    xLabels.push(entry.time);
    lowData.push(0.25);
    medData.push(0.5);
    highData.push(0.75);
    extremeData.push(1);
    yData.push(entry.riskValue);
  }

  const config = {
    type: "line",
    data: {
      labels: xLabels,
      datasets: [
        {
          label: "Revenue",
          data: lowData,
          fill: "start",
          borderWidth: 0,
          pointRadius: 0,
          borderColor: "rgba(0, 255, 0, 0.2)",
          backgroundColor: "green",
        },
        {
          label: "Revenue",
          data: medData,
          fill: "start",
          borderWidth: 0,
          pointRadius: 0,
          borderColor: "rgba(0, 255, 0, 0.2)",
          backgroundColor: "yellow",
        },
        {
          label: "Revenue",
          data: highData,
          fill: "start",
          borderWidth: 0,
          pointRadius: 0,
          borderColor: "rgba(0, 255, 0, 0.2)",
          backgroundColor: "orange",
        },
        {
          label: "Revenue",
          data: extremeData,
          fill: "start",
          borderWidth: 0,
          pointRadius: 0,
          borderColor: "rgba(0, 255, 0, 0.2)",
          backgroundColor: "red",
        },
        {
          label: "Data",
          data: yData,
          borderColor: "black",
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            stacked: false,
            ticks: {
              min: 0,
              max: 1,
            },
          },
        ],
      },
      legend: {
        display: false,
      },
    },
  };

  const encodedConfig = encodeURIComponent(JSON.stringify(config));
  const chartUrl = `https://quickchart.io/chart?c=${encodedConfig}`;

  return chartUrl;
}

/**
 * Checks if a user has enough points to meet a specific condition.
 *
 *@param {Object} userData - The user data retrieved from the Realtime Database.
 *@return {boolean} - True if the user meets the condition, false otherwise.
 */
async function calculateCondition(userData) {
  //   console.log(userData);
  if (userData.geoData == undefined || userData.geoData == null) {
    const geoData = {
      latitude: -33.8,
      longitude: 151.01,
    };
    const res = await getHSSData(geoData, userData.settings);
    return res;
  } else {
    const res = await getHSSData(userData.geoData, userData.settings);
    return res;
  }
}

/**
 *
 *@param {Object} riskLevel -.
 *@param {Object} images -.
 *@return {Object} - True if the user meets the condition, false otherwise.
 */
function getRecommendationsForRiskLevel(riskLevel, images) {
  return detailedRecommendationTips.tips
    .filter((tip) => tip.riskLevel.includes(riskLevel))
    .map(
      (tip) => `
        <div>
          <img 
            src="data:image/png;base64,${images[tip.icon]}" 
            alt="${tip.icon}" width="35" height="35"
          >
          <p>${tip.label}</p>
        </div>
      `
    )
    .join("");
}

/**
 * Checks if a user has enough points to meet a specific condition.
 */
async function checkVerifiedUsersLogic() {
  // Get all users
  const usersList = await admin.auth().listUsers();

  const imagesSnapshot = await admin.database().ref("images").once("value");
  const images = imagesSnapshot.val();

  // Iterate through users and check if they are verified
  usersList.users.forEach(async (user) => {
    if (user.emailVerified) {
      // Retrieve the user data from
      // the Realtime Database using the user's UID
      const userDataSnapshot = await admin
        .database()
        .ref(`users/${user.uid}`)
        .once("value");
      const userData = userDataSnapshot.val();

      if (userData.emailSubscription) {
        // Perform calculations and determine if the user meets the condition
        const res = await calculateCondition(userData);
        console.log(user.uid);
        // console.log(userData.settings);
        console.log(userData.geoData);
        console.log(res);
        // Send an email to users who meet the condition
        if (res.todayMaxRiskValue >= 0.5) {
          const recommendations = getRecommendationsForRiskLevel(
            res.todayMaxLevel,
            images
          );

          console.log("Generating Chart");
          const todayData = res.todayData;
          const chartString = await generateChartImage(todayData);
          console.log("Chart Generated");

          const mailOptions = {
            from: "oliverzheng74902744@gmail.com",
            to: user.email,
            subject: "HSS Warning",
            html: `            
            <body>
                <p>Dear ${user.displayName || "User"},</p>

                <p>Please note that the max heat stress risk for today is
                ${res.todayMaxLevel}.</p>

                <p>You can minimise the risk by following these
                simple recommendations:</p>
                
                ${recommendations}

                <img src=${chartString} alt="Your Chart">
                  
                <p>Please check the <a href="https://dehuanzheng.github.io/USYD_Capstone_Project_CS08/">Heat Stress Scale application</a> to learn more.</p>

                <p>Regards,<br>
                Heat and Health Research incubator</p>

                <img src="data:image/png;base64,${
                  images.usydLogo
                }" alt="USYD Logo">
            </body>
            `,
          };
          try {
            await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${user.email}`);
          } catch (error) {
            console.error(`Failed to send email to ${user.email}:`, error);
          }
        }
      }
    }
  });
}

// Scheduled function to check for verified users,
// retrieve their data, perform calculations, and send emails
exports.checkVerifiedUsers = functions
  .runWith({
    timeoutSeconds: 540, // Keep the existing timeout
    memory: "512MB", // Increase the memory limit to 512MB (or another value that suits your needs)
  })
  .pubsub.schedule("0 0 * * *")
  .timeZone("Australia/Sydney")
  .onRun(async (context) => {
    try {
      await checkVerifiedUsersLogic();
    } catch (error) {
      console.error("Error: ", error);
      console.trace("Error trace:");
    }
  });

// functions
//   .runWith({
//     timeoutSeconds: 540, // Keep the existing timeout
//     memory: "512MB", // Increase the memory limit to 512MB (or another value that suits your needs)
//   })
//   .https.onRequest(checkVerifiedUsersLogic);

// exports.checkVerifiedUsersLogic = checkVerifiedUsersLogic;

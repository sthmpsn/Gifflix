//API KEY: AnVFzv8FXQHu7I3N2iftwX1X5a4cNrCM
let apiKey = "AnVFzv8FXQHu7I3N2iftwX1X5a4cNrCM";
// Number of Gifs to display for each category
let NUM_GIFS = 15;
let TRENDING_LIMIT = 9; 

// String array of starting topics that will get a button dynamically created for it
const TOPICS = [
    "cat",
    "dog",
    "panda"
];

// [START] AFTER PAGE LOAD
$(document).ready(function () {

    // create the inital Image Wrapper for each topic in the topics Array
    // must use an "async" function so that the we can get the giphy results back and use it
    TOPICS.forEach(async function (topic) {
        // Get the FIRST Giphy image for each topic
        let coverImg = await getCoverImg(topic);  
        
        // Call the below function to generate the "Topics" HTML 
        generateTopicsHTML(topic,coverImg);

    });


    // Load Trending Topics
    async function getTrending(){
        let giphyData = await getGiphyImage("Trending", TRENDING_LIMIT);
        generateTrendingHTML(giphyData);

    }


    async function getCoverImg(topic){
        // Get the FIRST Giphy data for each topic
        let giphyTopicData = await getGiphyImage(topic,1); 
        // set the first giphy "still" image as the coverImg
        let coverImg = giphyTopicData[0].images.original_still.url 

        return coverImg;
    }



    function getGiphyImage(search, limit){
        // This function will return a new promise since it depends on external data being retrieved
        return new Promise((resolve,reject) => {
            let queryURL = "";

            // If the search = "trending" then we want to get a list of trending gifs and not a search
            queryURL = (search === "trending") 
                ? "https://api.giphy.com/v1/gifs/trending" 
                : "https://api.giphy.com/v1/gifs/search?q=" + search + "&limit=" + limit + "&api_key=" + apiKey;

                console.log("Search String: ", queryURL);

            $.ajax({
                url: queryURL,
                method: "GET"
            })
                .then(response => resolve(response.data))  // If successful then return "resolve" along with response.data
                .catch(error => reject(error));  // If error getting data then return "reject" with error msg
        });
    }


    function generateTopicsHTML(newTopic, coverImg){
        // This function will generate the Topics section
        // Load the first giphy image as the Topic Cover

        let $topicsContentDiv = $("#topics-content"); // Get the "topics-content" div element
        let topicsContent = ""; 

        topicsContent = $(` <div class="topics-img-wrapper d-inline-block m-2 clickable">
                                <img id="${newTopic}" class="topics-img rounded " src="${coverImg}" alt="${newTopic} image">
                                <div class="topics-caption">
                                    <h3 class="topics-title text-center">${newTopic} Gifs!</h3>
                                </div>
                            </div> 
                        `);
                        
        $topicsContentDiv.append(topicsContent);
    }

    // Generate the HTML for the Trending section 
    function generateTrendingHTML(trendingGifs){
        console.log("Trending Data: ", trendingGifs);
        let $trendingContentDiv = $("#trending-content");  // Get the "trending-content" div element
        let trendingContent = "";

        for (let i= 0; i < trendingGifs.length; i++){
            let imgAnimateURL = trendingGifs[i].images.original.url;  // Animated Gif URL 
            let gifTitle = trendingGifs[i].title;
            console.log("Trending Animated URL: ",imgAnimateURL,"\nGif Title: ",gifTitle);
            trendingContent =   $(` <div class="trending-img-wrapper m-2">
                                        <img id="${gifTitle}" class="trending-img rounded" src="${imgAnimateURL}" alt="${gifTitle} image">
                                    </div> 
                                `);

            $trendingContentDiv.append(trendingContent);
        }
    }





    let loadGifModal = async (topic) => {
        console.log("In the Load Gif Modal function")

        let $giphyModalBodyDiv = $("#giphy-modal-body"); // Get the "giphy-modal-body" div element
        let modalBodyContent = "";

        $giphyModalBodyDiv.empty(); // Clear any previous content

        let giphyData = await getGiphyImage(topic, NUM_GIFS);  // Get the appropriate topic and number of gifs to display

        for (let i= 0; i < giphyData.length; i++){
            let imgStillURL = giphyData[i].images.original_still.url;  // Still image URL
            let imgAnimateURL = giphyData[i].images.original.url;  // Animated Gif URL 

            modalBodyContent = $(` <div class="modal-img-wrapper d-inline-block mx-2 clickable">
                                        <img class="${topic}-gifs rounded giphyImg" src="${imgStillURL}" alt="${topic} image" data-state="still" data-still="${imgStillURL}" data-animate="${imgAnimateURL}" >
                                    </div> 
                                `);
                            
            $giphyModalBodyDiv.append(modalBodyContent);
            
        }

        $("#giphy-modal").modal('show');

    }
    

    getTrending();  // Load the Trending Giphys


    // *******************
    // *  Even Handling  * 
    // *******************

    // Handle Clicking of a Topic Image
    $(document).on("click", ".topics-img-wrapper", function () {

        let selectedTopic = $(this).children(":first").attr("id");  // Get the first child (the img node) and the "id" attribute of it
        
        // Pass the Topic name to the "loadGifModal()" function to load the gifs for that topic in the giph-modal
        loadGifModal(selectedTopic);  

    });

    // Handle Clicking of a Giphy Image
    $(document).on("click", ".giphyImg", function(){
        let imgObj = $(this);                      // Set imgObj to the current Object being passed
        let imgState = imgObj.attr("data-state");  // Get the current "data-state" of the image
        console.log("imgObj:",imgObj,"\nState:", imgState);  // Degub purposes

        // If giphy image state is "still" then set to 
        if (imgState === "still"){
            let animateURL = imgObj.attr("data-animate"); // Grab the animated gif URL of the current image
            imgObj.attr("src",animateURL); // Set the current src attribute to the animated gif URL which will start the animation
            imgObj.attr("data-state", "animated"); // Set the data-state attribute to "animated" to signify that the animation is active
        } else{
            let stillURL = imgObj.attr("data-still"); // Grag the still image URL of the current image
            imgObj.attr("src", stillURL);  // Set the current src attribute to the still image URL which stops the animation
            imgObj.attr("data-state", "still");  // Set the data-state attribute to "still" to signify that the still image is active
        }

    });


    // Handle adding a new Topic
    $(document).on("click", "#addNewTopicBtn", async function () {
        event.preventDefault();  //Prevent the Submit button from acting like a Submit button and do the following
        console.log("Add Topic was Clicked"); // Debug purposes

        let customTopic = $("#addNewTopicInput").val();

        if(customTopic){
            console.log("truthy data was in here");
            let coverImg = await getCoverImg(customTopic);
            generateTopicsHTML(customTopic,coverImg); // Add a new topic with associated coverImg
        }else{
            console.log("Falsy data");
        }

    });



});  // [END] AFTER PAGE LOAD
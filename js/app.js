//API KEY: AnVFzv8FXQHu7I3N2iftwX1X5a4cNrCM
let apiKey = "AnVFzv8FXQHu7I3N2iftwX1X5a4cNrCM";
// Number of Gifs to display for each category
let NUM_GIFS = 15;

// String array of starting topics that will get a button dynamically created for it
const TOPICS = [
    "cat",
    "dog",
    "panda"
];

// AFTER PAGE LOAD
$(document).ready(function () {

    // create the inital Image Wrapper for each topic in the topics Array
    // must use an "async" function so that the we can get the giphy results back and use it
    TOPICS.forEach(async function (topic) {
        // Get the FIRST Giphy data for each topic
        let giphyTopicData = await getGiphyImage(topic,1); 
        // set the first giphy "still" image as the coverImg
        let coverImg = giphyTopicData[0].images.original_still.url  
        
        // Call the below function to generate the "Topics" HTML 
        generateTopicsHTML(topic,coverImg);

    });



    function getGiphyImage(search, limit){
        // This function will return a new promise since it depends on external data being retrieved
        return new Promise((resolve,reject) => {
            let queryURL = "https://api.giphy.com/v1/gifs/search?q=" + search + "&limit=" + limit + "&api_key=" + apiKey;

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

        topicsContent = $(` <div class="topics-img-wrapper d-inline-block mx-2 ">
                                <img id="${newTopic}" class="topics-img rounded" src="${coverImg}" alt="${newTopic} image">
                                <div class="topics-caption">
                                    <h3 class="topics-title">${newTopic} Gifs!</h3>
                                </div>
                            </div> 
                        `);
                        
        $topicsContentDiv.append(topicsContent);
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

            modalBodyContent = $(` <div class="topics-img-wrapper d-inline-block mx-2">
                                        <img id="${topic}" class="topics-img rounded" src="${imgStillURL}" alt="${topic} image">
                                    </div> 
                                `);
                            
            $giphyModalBodyDiv.append(modalBodyContent);
            
        }

        $("#giphy-modal").modal('show');

    }
    


    //Even Handling

    $(document).on("click", ".topics-img-wrapper", function () {
        if ($(".resultsDiv" === null)) {
            $(".resultsDiv").empty();
        }

        let selectedTopic = $(this).children(":first").attr("id");  // Get the first child (the img node) and the "id" attribute of it
        
        // Pass the Topic name to the "loadGifModal()" function to load the gifs for that topic in the giph-modal
        loadGifModal(selectedTopic);  

    });

    





    

    // $(document).on("click", ".giphyImg", function () {
    //     //if img data-state equals "static" then change to "animated" and vice-versa
    //     let imgObj = $(this)                         // get the image object that was clicked
    //     let imgState = imgObj.attr("data-state");   // get the current img state
    //     if (imgState === "still") {
    //         let animateURL = imgObj.attr("data-animate");
    //         imgObj.attr("src", animateURL);
    //         imgObj.attr("data-state", "animated");
    //     }
    //     else {
    //         let stillURL = imgObj.attr("data-still");
    //         imgObj.attr("src", stillURL);
    //         imgObj.attr("data-state", "still");
    //     }

    // });

    // $(document).on("click", "#submit-search", function () {
    //     event.preventDefault();  //Prevent the Submit button from acting like a Submit button and do the following
    //     console.log("Add Topic was Clicked");
    //     let $channelSearch = $("#channelSearch").val();
    //     console.log($channelSearch);
    //     getCoverImg($channelSearch);

    // });

    


});
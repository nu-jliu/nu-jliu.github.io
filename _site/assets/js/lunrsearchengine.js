
var documents = [{
    "id": 0,
    "url": "http://localhost:4000/404.html",
    "title": "404",
    "body": "404 Page does not exist!Please use the search bar at the top or visit our homepage! "
    }, {
    "id": 1,
    "url": "http://localhost:4000/categories",
    "title": "Categories",
    "body": ""
    }, {
    "id": 2,
    "url": "http://localhost:4000/",
    "title": "Home",
    "body": "      Featured Projects:                           All Projects:                                                                                                     Polyglot Bot Translator Robot              :       Python, ROS2, Moveit2, YOLO, OCR, AprilTags:                               10 Dec 2023        &lt;/span&gt;                                                                                                                             Feedback Control on KUKA youBot              :       MATLAB, Robot Dynamics, Feedback Control, Feedforward Control, Mobile Manipulator:                               06 Dec 2023        &lt;/span&gt;                                    "
    }, {
    "id": 3,
    "url": "http://localhost:4000/JamesOubre_Resume",
    "title": "Resume and Contact Info",
    "body": "Contactjamesoubre2023@u. northwestern. edu: GitHub: LinkedIn: Download Resume as a PDF: "
    }, {
    "id": 4,
    "url": "http://localhost:4000/robots.txt",
    "title": "",
    "body": "      Sitemap: {{ “sitemap. xml”   absolute_url }}   "
    }, {
    "id": 5,
    "url": "http://localhost:4000/ployglotbot/",
    "title": "Polyglot Bot Translator Robot",
    "body": "2023/12/10 - Python, ROS2, Moveit2, YOLO, OCR, AprilTags Authors: Allen Liu, Damien Koh, Kassidy Shedd, Henry Brown, Megan Black Project DescriptionThis project is to control a franka Panda arm to reads in a sentence in any kind of language and then translated into the target one. ArchitectureThis project consists of 5 subsystems, in which each group member is in charge of one of them:  translation: Damine was in charge of this subsystem, which calls google-translation API for translating from the source language to the target language.  computer_vision: Megan was in charge of this subsystem, which uses the YOLO and ocr python package for recongnizing texts and human detection.  string2waypoints: Kassidy as in charge of this subsystem, which uses the matplotlib python package to generate the waypoints for robot to travel through.  writer: I was in chage of this subsystem, which uses the cartesian path planner from moveit2 package to find and execute the path for the robot to write the specific characters on the write board, while calibrating the relative location of the whiteboard using the apriltags.  apriltags: Henry was in charge of this subsystem, which uses the apriltag_ros package for detecting the location and orientation of each apriltag, used for pinpointing the location and orientation of the whiteboard. FeaturesTranslate from Chinese to English: Translate from German to French: Translate from Spanish to Korean: Translate from Simpified Chinese to Traditional Chinese: Hindi Voice to English: Spanish Voice to English: Challenges Cartesian Path Planner: When first implementing the find cartesian path feature over moveit API, we faced the issue where the rviz showed that robot already found the path, but just not be able to execute it. So we looked through our code for the moveit API on the function that calls the ComputeCartesianPath service. And compare that with the official documentation for the moveit and then we found that me have a missing parameter called cartesian_speed_limit_link that we have not specified. Eventually after we fill in that blank, the robot moves as expected.  TF tree when integrating apriltags: When we first implemented the apriltags on the robot, we experienced some issue that sometimes the robot does not move as intended, that moving towards the orientation and position that will cause the collision. We started debug by examing the TF tree of the robot and did a lot experiments sending various command telling robot to move in all possible directions. And finally when we are examing the TF tree for the robot, we realize that as apriltags are added to the system, the root frame of the TF tree became the camera instead of the panda_link0, which is the base frame of the robot. So that the command we are sending is relaive to the camera frame instead of base frame. After we fix that, the robot moves perfectly. Possible improvements.  Some script language still fail to detect.  Sometimes, the camera source get dropped, need to re-launch all. "
    }, {
    "id": 6,
    "url": "http://localhost:4000/youbot/",
    "title": "Feedback Control on KUKA youBot",
    "body": "2023/12/06 - MATLAB, Robot Dynamics, Feedback Control, Feedforward Control, Mobile Manipulator Authors: Allen Liu Project DescriptionThis project is to implement the feedforward/feedback control over the KUKA youBot to pick up a cube and place it at another place in the world. GoalThe goal of this project is to find the propotional gain $K_p$ and integral gain $K_i$ at 3 given scenarios: Best, Overshoot and New Task Best: For the Best controller, the target is to design the controller that robot follows the planned path perfectly without any oscillation. Overshoot: The Overshoot controller is designed to follow the planned path, but oscillates around the planned path. FeaturesTranslate from Chinese to English: Translate from German to French: Translate from Spanish to Korean: Translate from Simpified Chinese to Traditional Chinese: Hindi Voice to English: Spanish Voice to English: Challenges Cartesian Path Planner: When first implementing the find cartesian path feature over moveit API, we faced the issue where the rviz showed that robot already found the path, but just not be able to execute it. So we looked through our code for the moveit API on the function that calls the ComputeCartesianPath service. And compare that with the official documentation for the moveit and then we found that me have a missing parameter called cartesian_speed_limit_link that we have not specified. Eventually after we fill in that blank, the robot moves as expected.  TF tree when integrating apriltags: When we first implemented the apriltags on the robot, we experienced some issue that sometimes the robot does not move as intended, that moving towards the orientation and position that will cause the collision. We started debug by examing the TF tree of the robot and did a lot experiments sending various command telling robot to move in all possible directions. And finally when we are examing the TF tree for the robot, we realize that as apriltags are added to the system, the root frame of the TF tree became the camera instead of the panda_link0, which is the base frame of the robot. So that the command we are sending is relaive to the camera frame instead of base frame. After we fix that, the robot moves perfectly. Possible improvements.  Some script language still fail to detect.  Sometimes, the camera source get dropped, need to re-launch all. "
    }];

var idx = lunr(function () {
    this.ref('id')
    this.field('title')
    this.field('body')

    documents.forEach(function (doc) {
        this.add(doc)
    }, this)
});
function lunr_search(term) {
    document.getElementById('lunrsearchresults').innerHTML = '<ul></ul>';
    if(term) {
        document.getElementById('lunrsearchresults').innerHTML = "<p>Search results for '" + term + "'</p>" + document.getElementById('lunrsearchresults').innerHTML;
        //put results on the screen.
        var results = idx.search(term);
        if(results.length>0){
            //console.log(idx.search(term));
            //if results
            for (var i = 0; i < results.length; i++) {
                // more statements
                var ref = results[i]['ref'];
                var url = documents[ref]['url'];
                var title = documents[ref]['title'];
                var body = documents[ref]['body'].substring(0,160)+'...';
                document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML = document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML + "<li class='lunrsearchresult'><a href='" + url + "'><span class='title'>" + title + "</span><br /><span class='body'>"+ body +"</span><br /><span class='url'>"+ url +"</span></a></li>";
            }
        } else {
            document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML = "<li class='lunrsearchresult'>No results found...</li>";
        }
    }
    return false;
}

function lunr_search(term) {
    $('#lunrsearchresults').show( 400 );
    $( "body" ).addClass( "modal-open" );
    
    document.getElementById('lunrsearchresults').innerHTML = '<div id="resultsmodal" class="modal fade show d-block"  tabindex="-1" role="dialog" aria-labelledby="resultsmodal"> <div class="modal-dialog shadow-lg" role="document"> <div class="modal-content"> <div class="modal-header" id="modtit"> <button type="button" class="close" id="btnx" data-dismiss="modal" aria-label="Close"> &times; </button> </div> <div class="modal-body"> <ul class="mb-0"> </ul>    </div> <div class="modal-footer"><button id="btnx" type="button" class="btn btn-danger btn-sm" data-dismiss="modal">Close</button></div></div> </div></div>';
    if(term) {
        document.getElementById('modtit').innerHTML = "<h5 class='modal-title'>Search results for '" + term + "'</h5>" + document.getElementById('modtit').innerHTML;
        //put results on the screen.
        var results = idx.search(term);
        if(results.length>0){
            //console.log(idx.search(term));
            //if results
            for (var i = 0; i < results.length; i++) {
                // more statements
                var ref = results[i]['ref'];
                var url = documents[ref]['url'];
                var title = documents[ref]['title'];
                var body = documents[ref]['body'].substring(0,160)+'...';
                document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML = document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML + "<li class='lunrsearchresult'><a href='" + url + "'><span class='title'>" + title + "</span><br /><small><span class='body'>"+ body +"</span><br /><span class='url'>"+ url +"</span></small></a></li>";
            }
        } else {
            document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML = "<li class='lunrsearchresult'>Sorry, no results found. Close & try a different search!</li>";
        }
    }
    return false;
}
    
$(function() {
    $("#lunrsearchresults").on('click', '#btnx', function () {
        $('#lunrsearchresults').hide( 5 );
        $( "body" ).removeClass( "modal-open" );
    });
});
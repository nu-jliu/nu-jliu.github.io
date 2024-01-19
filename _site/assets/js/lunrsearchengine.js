
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
    "body": "      Featured Projects:                                                                                                                                                                                                           Polyglot Bot Translator Robot                              :               OCR, YOLO, Python, ROS2, MoveIt2, Emika Franka Robot Arm:                                                                       10 Dec 2023                &lt;/span&gt;                                                                                                                                                                                                                                                                                                        Rapidly_exploring Random Tree                              :               Python, RRT:                                                                       12 Sep 2023                &lt;/span&gt;                                                                                                            All Projects:                                                                                                     Polyglot Bot Translator Robot              :       OCR, YOLO, Python, ROS2, MoveIt2, Emika Franka Robot Arm:                               10 Dec 2023        &lt;/span&gt;                                                                                                                             Feedback Control on KUKA youBot              :       MATLAB, Robot Dynamics, Feedback Control, Feedforward Control, Mobile Manipulator, CoppeliaSim:                               06 Dec 2023        &lt;/span&gt;                                                                                                                             Rapidly_exploring Random Tree              :       Python, RRT:                               12 Sep 2023        &lt;/span&gt;                                                                                                                             Maze Runner              :       Python, Wavefront, Recursive Backtracking, Randomized Prim:                               10 Sep 2023        &lt;/span&gt;                                    "
    }, {
    "id": 3,
    "url": "http://localhost:4000/allen_resume",
    "title": "Resume and Contact Info",
    "body": "Contactjingkunliu2025@u. northwestern. edu: GitHub: LinkedIn: Download Resume as a PDF: "
    }, {
    "id": 4,
    "url": "http://localhost:4000/robots.txt",
    "title": "",
    "body": "      Sitemap: {{ “sitemap. xml”   absolute_url }}   "
    }, {
    "id": 5,
    "url": "http://localhost:4000/ployglotbot/",
    "title": "Polyglot Bot Translator Robot",
    "body": "2023/12/10 - OCR, YOLO, Python, ROS2, MoveIt2, Emika Franka Robot Arm Authors: Allen Liu, Damien Koh, Kassidy Shedd, Henry Brown, Megan Black Project DescriptionLead the team in creating a sophisticated system that can process input from either text written on a whiteboard or audio received through a microphone. This ambitious project involves multiple stages, including text and speech recognition, language identification, translation into the target language, and the unique aspect of controlling a robot arm to physically write the translated text onto a whiteboard. The team will need to implement strong text and speech recognition capabilities, incorporating language detection mechanisms for accurate translation. The integration of a robot arm introduces a novel challenge, requiring seamless communication between language processing components and the robotic control system. Collaboration across domains such as natural language processing, machine learning, computer vision, and robotics is essential for success. Emphasize usability, accuracy, and real-time responsiveness throughout the development process, with regular testing and iterative improvements to refine the system’s performance. As the team leader, encourage a creative and problem-solving mindset, fostering effective communication and coordination to bring together the diverse components into a cohesive and functional system. ArchitectureThis project consists of 5 subsystems, in which each group member is in charge of one of them:  writer: Allen was in chage of this subsystem, which uses the cartesian path planner from moveit2 package to find and execute the path for the robot to write the specific characters on the write board, while calibrating the relative location of the whiteboard using the apriltags.  translation: Damine was in charge of this subsystem, which calls google-translation API for translating from the source language to the target language.  computer_vision: Megan was in charge of this subsystem, which uses the YOLO and ocr python package for recongnizing texts and human detection.  string2waypoints: Kassidy as in charge of this subsystem, which uses the matplotlib python package to generate the waypoints for robot to travel through.  apriltags: Henry was in charge of this subsystem, which uses the apriltag_ros package for detecting the location and orientation of each apriltag, used for pinpointing the location and orientation of the whiteboard. FeaturesTranslate from Chinese to English: Translate from German to French: Translate from Spanish to Korean: Translate from Simpified Chinese to Traditional Chinese: Hindi Voice to English: Spanish Voice to English: Challenges Cartesian Path Planner: When initially incorporating the find cartesian path functionality using the MoveIt API, we encountered a challenge where RViz indicated that the robot had identified the path but was unable to execute it. To address this issue, we examined our code related to the MoveIt API, specifically focusing on the function responsible for calling the ComputeCartesianPath service. Upon comparing our implementation with the official MoveIt documentation, we identified a crucial missing parameter known as cartesian_speed_limit_link, which had not been specified in our code. Once we addressed this omission and provided the necessary parameter, the robot successfully executed the intended movements.  TF tree when integrating apriltags: Upon the initial implementation of apriltags on the robot, we encountered an issue where the robot occasionally failed to move as intended, leading to collisions when approaching certain orientations and positions. To address this challenge, our debugging process involved a thorough examination of the TF tree associated with the robot. We conducted numerous experiments by sending various commands, instructing the robot to move in all possible directions. During this investigation, a crucial insight emerged when analyzing the TF tree. It was discovered that with the introduction of apriltags into the system, the root frame of the TF tree shifted from panda_link0, the base frame of the robot, to camera_link. Consequently, the commands we were sending were relative to the camera_link frame rather than the base frame. Upon rectifying this discrepancy, specifically aligning the commands with the correct base frame, the robot executed movements flawlessly. Possible improvements.  Some script language still fail to detect.  Sometimes, the camera source get dropped, need to re-launch all. "
    }, {
    "id": 6,
    "url": "http://localhost:4000/youbot/",
    "title": "Feedback Control on KUKA youBot",
    "body": "2023/12/06 - MATLAB, Robot Dynamics, Feedback Control, Feedforward Control, Mobile Manipulator, CoppeliaSim Authors: Allen Liu Project DescriptionThis project is to implement the feedforward/feedback control over the KUKA youBot to pick up a cube and place it at another place in the world. GoalThe goal of this project is to simulate the dynamics of the KUKA youBot in CopeliaSim and design the optimal controller given 3 scenarios: Best, Overshoot and New Task, in finding the values of proportinal gain Kp and integral gain Ki for each task.  Best: The robot follows the planned path without any overshoot and steady-state error.  Overshoot: The robot reaches the goal with zero steady-state error but overshoots along the way.  New Task: The robot follows the planned path to a new goal without overshoot and steady-state error. StructureThis overall project can be divided into 3 tasks: Kinematics, Path Planning and Feedback Control. Kinematic of the Mobile Platform: The KUKA youBot is modeled as a 4-wheel mobile robot, where each wheel can either moving in a stright-line or sliding sideways. The mobile platform is modeled as following: Cartesian Path Generator: To find the path from the start to the goal, I used the cartesian path planning to generate a 5th order cartesian path so that the robot starts and ends with zero accelerations. Feedback Control of the KUKA youBot: ResultsBest: The result for the Best controller is shown below: Overshoot: New Task: Challenges Finding Optimal Kp and Ki: Discovering the ideal values for Ki and Kp poses a challenge in designing controllers that excel in various scenarios. Achieving optimal performance necessitates an iterative process for each parameter. Theoretical values alone often fall short of delivering the best results. To overcome this challenge, I invest a substantial amount of time in conducting extensive experiments. This approach allows me to identify and refine the most effective values for the controller, ensuring optimal performance across diverse situations. Possible improvements.  Some script language still fail to detect.  Sometimes, the camera source get dropped, need to re-launch all. "
    }, {
    "id": 7,
    "url": "http://localhost:4000/rrt/",
    "title": "Rapidly_exploring Random Tree",
    "body": "2023/09/12 - Python, RRT Authors: Allen Liu Project DescriptionLead the team in implementing the ArchitectureThis project consists of 5 subsystems, in which each group member is in charge of one of them:  writer: Allen was in chage of this subsystem, which uses the cartesian path planner from moveit2 package to find and execute the path for the robot to write the specific characters on the write board, while calibrating the relative location of the whiteboard using the apriltags.  translation: Damine was in charge of this subsystem, which calls google-translation API for translating from the source language to the target language.  computer_vision: Megan was in charge of this subsystem, which uses the YOLO and ocr python package for recongnizing texts and human detection.  string2waypoints: Kassidy as in charge of this subsystem, which uses the matplotlib python package to generate the waypoints for robot to travel through.  apriltags: Henry was in charge of this subsystem, which uses the apriltag_ros package for detecting the location and orientation of each apriltag, used for pinpointing the location and orientation of the whiteboard. FeaturesTranslate from Chinese to English: Translate from German to French: Translate from Spanish to Korean: Translate from Simpified Chinese to Traditional Chinese: Hindi Voice to English: Spanish Voice to English: Challenges Cartesian Path Planner: When initially incorporating the find cartesian path functionality using the MoveIt API, we encountered a challenge where RViz indicated that the robot had identified the path but was unable to execute it. To address this issue, we examined our code related to the MoveIt API, specifically focusing on the function responsible for calling the ComputeCartesianPath service. Upon comparing our implementation with the official MoveIt documentation, we identified a crucial missing parameter known as cartesian_speed_limit_link, which had not been specified in our code. Once we addressed this omission and provided the necessary parameter, the robot successfully executed the intended movements.  TF tree when integrating apriltags: Upon the initial implementation of apriltags on the robot, we encountered an issue where the robot occasionally failed to move as intended, leading to collisions when approaching certain orientations and positions. To address this challenge, our debugging process involved a thorough examination of the TF tree associated with the robot. We conducted numerous experiments by sending various commands, instructing the robot to move in all possible directions. During this investigation, a crucial insight emerged when analyzing the TF tree. It was discovered that with the introduction of apriltags into the system, the root frame of the TF tree shifted from panda_link0, the base frame of the robot, to camera_link. Consequently, the commands we were sending were relative to the camera_link frame rather than the base frame. Upon rectifying this discrepancy, specifically aligning the commands with the correct base frame, the robot executed movements flawlessly. Possible improvements.  Some script language still fail to detect.  Sometimes, the camera source get dropped, need to re-launch all. "
    }, {
    "id": 8,
    "url": "http://localhost:4000/maze/",
    "title": "Maze Runner",
    "body": "2023/09/10 - Python, Wavefront, Recursive Backtracking, Randomized Prim Authors: Allen Liu, Anuj Natray, Henry Brown, Ishani Narwankar, Leo Li Project DescriptionLead the team in implementing the ArchitectureThis project consists of 5 subsystems, in which each group member is in charge of one of them:  writer: Allen was in chage of this subsystem, which uses the cartesian path planner from moveit2 package to find and execute the path for the robot to write the specific characters on the write board, while calibrating the relative location of the whiteboard using the apriltags.  translation: Damine was in charge of this subsystem, which calls google-translation API for translating from the source language to the target language.  computer_vision: Megan was in charge of this subsystem, which uses the YOLO and ocr python package for recongnizing texts and human detection.  string2waypoints: Kassidy as in charge of this subsystem, which uses the matplotlib python package to generate the waypoints for robot to travel through.  apriltags: Henry was in charge of this subsystem, which uses the apriltag_ros package for detecting the location and orientation of each apriltag, used for pinpointing the location and orientation of the whiteboard. FeaturesTranslate from Chinese to English: Translate from German to French: Translate from Spanish to Korean: Translate from Simpified Chinese to Traditional Chinese: Hindi Voice to English: Spanish Voice to English: Challenges Cartesian Path Planner: When initially incorporating the find cartesian path functionality using the MoveIt API, we encountered a challenge where RViz indicated that the robot had identified the path but was unable to execute it. To address this issue, we examined our code related to the MoveIt API, specifically focusing on the function responsible for calling the ComputeCartesianPath service. Upon comparing our implementation with the official MoveIt documentation, we identified a crucial missing parameter known as cartesian_speed_limit_link, which had not been specified in our code. Once we addressed this omission and provided the necessary parameter, the robot successfully executed the intended movements.  TF tree when integrating apriltags: Upon the initial implementation of apriltags on the robot, we encountered an issue where the robot occasionally failed to move as intended, leading to collisions when approaching certain orientations and positions. To address this challenge, our debugging process involved a thorough examination of the TF tree associated with the robot. We conducted numerous experiments by sending various commands, instructing the robot to move in all possible directions. During this investigation, a crucial insight emerged when analyzing the TF tree. It was discovered that with the introduction of apriltags into the system, the root frame of the TF tree shifted from panda_link0, the base frame of the robot, to camera_link. Consequently, the commands we were sending were relative to the camera_link frame rather than the base frame. Upon rectifying this discrepancy, specifically aligning the commands with the correct base frame, the robot executed movements flawlessly. Possible improvements.  Some script language still fail to detect.  Sometimes, the camera source get dropped, need to re-launch all. "
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
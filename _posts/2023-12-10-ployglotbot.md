---
layout: post
title:  "Polyglot Bot Translator Robot"
categories: [ OCR, YOLO, Python, ROS2, MoveIt2 ]
image: assets/images/polyglotbot.gif
featured: false
hidden: false
---

Python, ROS2, Moveit2, YOLO, OCR, AprilTags

**Authors**: Allen Liu, Damien Koh, Kassidy Shedd, Henry Brown, Megan Black

# Project Description
This project is to control a franka Panda arm to reads in a sentence in any kind of language and then translated into the target one.

# Architecture
This project consists of 5 subsystems, in which each group member is in charge of one of them:
 - `translation`: Damine was in charge of this subsystem, which calls `google-translation` API for translating from the source language to the target language.
 - `computer_vision`: Megan was in charge of this subsystem, which uses the `YOLO` and `ocr` python package for recongnizing texts and human detection.
 - `string2waypoints`: Kassidy as in charge of this subsystem, which uses the `matplotlib` python package to generate the waypoints for robot to travel through.
 - `writer`: I was in chage of this subsystem, which uses the `cartesian path planner` from `moveit2` package to find and execute the path for the robot to write the specific characters on the write board, while calibrating the relative location of the whiteboard using the apriltags. 
 - `apriltags`: Henry was in charge of this subsystem, which uses the `apriltag_ros` package for detecting the location and orientation of each apriltag, used for pinpointing the location and orientation of the whiteboard. 

# Features

## Translate from Chinese to English
<iframe width="560" height="315" src="https://www.youtube.com/embed/EdNptTr9Y0U?si=ZA9z5NeRokLx9CQw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Translate from German to French
<iframe width="560" height="315" src="https://www.youtube.com/embed/iFoNAHWQ9wE?si=es4q5_6K3KzxVzFM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Translate from Spanish to Korean
<iframe width="560" height="315" src="https://www.youtube.com/embed/Qjd3jGlU8Ds?si=3aTC0FWY6vf4mSaL" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Translate from Simpified Chinese to Traditional Chinese 
<iframe width="560" height="315" src="https://www.youtube.com/embed/9GdGPy74Qwg?si=FwCUxvQhKl4Oi-Fo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Hindi Voice to English
<iframe width="560" height="315" src="https://www.youtube.com/embed/BeQzYUYSe5k?si=6rlJjthlDPSmCw-F" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Spanish Voice to English
<iframe width="560" height="315" src="https://www.youtube.com/embed/9PCf_-gbIbU?si=YZCxg8eNQXIZg_Oy" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

# Challenges
1. *Cartesian Path Planner*: When first implementing the `find cartesian path` feature over `moveit` API, we faced the issue where the `rviz` showed that robot already found the path, but just not be able to execute it. So we looked through our code for the `moveit` API on the function that calls the `ComputeCartesianPath` service. And compare that with the official documentation for the moveit and then we found that me have a missing parameter called `cartesian_speed_limit_link` that we have not specified. Eventually after we fill in that blank, the robot moves as expected.
2. *TF tree when integrating apriltags*: When we first implemented the `apriltags` on the robot, we experienced some issue that sometimes the robot does not move as intended, that moving towards the orientation and position that will cause the collision. We started debug by examing the TF tree of the robot and did a lot experiments sending various command telling robot to move in all possible directions. And finally when we are examing the TF tree for the robot, we realize that as `apriltags` are added to the system, the root frame of the TF tree became the `camera` instead of the `panda_link0`, which is the base frame of the robot. So that the command we are sending is relaive to the `camera` frame instead of base frame. After we fix that, the robot moves perfectly.

# Possible improvements.
 - Some script language still fail to detect.
 - Sometimes, the camera source get dropped, need to re-launch all.
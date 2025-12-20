---
layout: post
title:  "Polyglot Translator Robot"
categories: [ OCR, YOLO, Python, ROS2, MoveIt2, Emika Franka Robot Arm ]
image: assets/images/polyglotbot.gif
featured: true
hidden: true
---

OCR, YOLO, Python, ROS2, MoveIt2, Emika Franka Robot Arm

**Authors**: Allen Liu, Damien Koh, Kassidy Shedd, Henry Brown, Megan Black

**GitHub**: [View this project on GitHub](https://github.com/nu-jliu/final-project-me495)

# Project Description

This project implements a multilingual translation robot system that processes input from either written text on a whiteboard or spoken audio through a microphone. The system performs real-time language detection, translation, and physically writes the translated output using a robotic arm.

## System Workflow

```mermaid
flowchart TD
    START([System Ready]) --> INPUT{Input Type?}

    INPUT -->|Visual| CAMERA[Capture Whiteboard Image]
    INPUT -->|Audio| MIC[Record Audio]

    CAMERA --> HUMAN_DET[Human Detection<br/>YOLO]
    HUMAN_DET -->|Person Detected| OCR_PROC[OCR Processing]
    HUMAN_DET -->|No Person| CAMERA

    MIC --> SPEECH_REC[Speech Recognition]

    OCR_PROC --> LANG_DET[Language Detection]
    SPEECH_REC --> LANG_DET

    LANG_DET --> TRANS[Google Translate API]
    TRANS --> GEN_WP[Generate Writing Waypoints]

    GEN_WP --> CALIB[AprilTag Calibration]
    CALIB --> PLAN[MoveIt2 Cartesian Path]
    PLAN --> WRITE[Robot Writes Translation]

    WRITE --> END([Complete])

    style TRANS fill:#fff4e1
    style PLAN fill:#e1f5ff
    style OCR_PROC fill:#d4edda
```

The system integrates natural language processing, machine learning, computer vision, and robotics to create a cohesive multilingual translation platform with physical output capabilities.

# System Architecture

This project integrates five specialized subsystems to enable multilingual translation and robotic writing.

```mermaid
graph TB
    subgraph Input["Input Processing"]
        TEXT[Text Input<br/>Whiteboard]
        AUDIO[Audio Input<br/>Microphone]
        YOLO[YOLO Object Detection]
        OCR[OCR Text Recognition]
        SPEECH[Speech Recognition]
    end

    subgraph Translation["Translation Engine"]
        DETECT_LANG[Language Detection]
        TRANSLATE[Google Translate API]
    end

    subgraph Planning["Path Planning"]
        STRING2WP[String to Waypoints<br/>Matplotlib]
        APRILTAG[AprilTag Detection<br/>Whiteboard Calibration]
    end

    subgraph Execution["Robot Control"]
        MOVEIT[MoveIt2 Cartesian Planner]
        FRANKA[Franka Emika Robot Arm]
    end

    TEXT --> YOLO
    YOLO --> OCR
    AUDIO --> SPEECH

    OCR --> DETECT_LANG
    SPEECH --> DETECT_LANG
    DETECT_LANG --> TRANSLATE

    TRANSLATE --> STRING2WP
    APRILTAG --> MOVEIT
    STRING2WP --> MOVEIT
    MOVEIT --> FRANKA

    style TRANSLATE fill:#fff4e1
    style MOVEIT fill:#e1f5ff
    style OCR fill:#d4edda
```

**Subsystem Responsibilities:**
 - **`writer`** (Allen): Cartesian path planning using MoveIt2 for writing characters on the whiteboard, with AprilTag-based calibration
 - **`translation`** (Damien): Google Translate API integration for language translation
 - **`computer_vision`** (Megan): YOLO object detection and OCR for text recognition and human detection
 - **`string2waypoints`** (Kassidy): Matplotlib-based waypoint generation for character trajectories
 - **`apriltags`** (Henry): AprilTag detection for whiteboard localization and orientation 

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
 - *Cartesian Path Planner*: When initially incorporating the `find cartesian path` functionality using the `MoveIt` API, we encountered a challenge where `RViz` indicated that the robot had identified the path but was unable to execute it. To address this issue, we examined our code related to the `MoveIt` API, specifically focusing on the function responsible for calling the `ComputeCartesianPath` service. Upon comparing our implementation with the official `MoveIt` documentation, we identified a crucial missing parameter known as `cartesian_speed_limit_link`, which had not been specified in our code. Once we addressed this omission and provided the necessary parameter, the robot successfully executed the intended movements.
 - *TF tree when integrating `apriltags`*: Upon the initial implementation of `apriltags` on the robot, we encountered an issue where the robot occasionally failed to move as intended, leading to collisions when approaching certain orientations and positions. To address this challenge, our debugging process involved a thorough examination of the `TF tree` associated with the robot. We conducted numerous experiments by sending various commands, instructing the robot to move in all possible directions. During this investigation, a crucial insight emerged when analyzing the `TF tree`. It was discovered that with the introduction of `apriltags` into the system, the root frame of the `TF tree` shifted from `panda_link0`, the base frame of the robot, to `camera_link`. Consequently, the commands we were sending were relative to the `camera_link` frame rather than the base frame. Upon rectifying this discrepancy, specifically aligning the commands with the correct base frame, the robot executed movements flawlessly.

# Possible Improvements
 - Some script language still fail to detect: To resolve this issue, we can try to refind the language model by training more dataset on the script languages making it easier to detect the script languages.
 - Sometimes, the camera source get dropped, need to re-launch all: This happened because sometimes the `realsense` camera package does not detect the camera successfully so that it will throw can error when that happens. To address this issue, we can surround that with a protect function that catch the error when it throws and try it again.
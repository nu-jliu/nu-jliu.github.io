---
layout: post
title: "Autonomous Cell Culture Robotic System"
categories: [ C++, Python, ROS2, YOLO, OpenCV, React, Java, React, SpringBoot, MySQL, UART, ATMega2560 ]
image: assets/images/mito.png
hidden: false
featured: false
---

C++, Python, ROS2, YOLO, OpenCV, React, Java, React, SpringBoot, MySQL, UART, ATMega2560

**Author**: Allen Liu

The goal of this project is to build a robotic system to automate the process of the cell culture. The robotic system a gantry robot to perform the liquid and flask handling, flask platform to hold and manuver the flasks, a custom-built microscope to validate the cell organism as well as a web application for user-interaction and teleoperation.

# Architecture

This system can be split into four parts: 
1. Robotic Control software using `ROS2 Iron` on `Nvidia Jetson Orin Nano`
2. Motor control embedded software using embedded `C++`
3. A 3-tier web application using `React.js`, `Java Spring-Boot` and `MySQL`
4. Micrroscope Controller software

The overall software architecture is shown in the diagram below:

![](/assets/images/mito-system.png)

In this system the robotic software and web application will be communicated via HTTP protocol that web application can send command to  the robotic software while robotic software will stream the live status of the robot to the web and display it to the user. On the cloud side, the cell image will be taken from the microscope control software and upload it to cloud while cloud will perform the analysis using AI and send the result and image to the web.

## Robotic Control Software Architecture

The robotic software is intregated over `ROS2 Iron` platform to ensure seamless communication between processes. The `ROS2` platform is using `Fast DDS` to implement the Inter-Process Communication (IPC), that all process can be easily communicate with each other as long as they are on the same subnet.

The architecture of the Robotic control software is shown in the diagram below:

![](/assets/images/rosgraph_mito.png)

The entire software consists of 10 packages:

 - `dynamixel_control`: Package to control the dynamixel motor on flask and pump operation.
   - Communicates with the `dynamixel` motors via `RS485`
 - `festo_control`: Package to control the festo pump to dispense and aspirate liquid.
 - `gantry_control`: Package to do the motion control of the gantry robot.
   - Communicates with the microcontroller via serial port.
 - `gantry_interfaces`: Custom interfaces for transporting data between processes.
 - `microscope_control`: Control the actions of the microscope.
   - Communicate with microscope via `MQTT 2.0`
 - `protocol_executer`: Execute the high-level protocols of the robot system.
   - Handles the external request over `HTTP 1.0`
 - `robot_control`: Launch all controller of the robot.
 - `robot_vision`: Perform the computer vision calculation of the robot.
   - `YOLOv8` object detection model to detect flask
   - `YOLOv8` classification model to classify cell
   - Segment the cells using `OpenCV` for calculating confluency
 - `robot_viz`: Visualize the robot system.



## Web Application Architecture

 The web application is a 3-tier software architectutre with Presentation layer written in `React.js`, application layer written by `Java 21` using `Spring-Boot 3.0` framework and a storage layer using `MySQL`.

 The software architecture of the Web Application is shown in the figure below:

 ![](/assets/images/mito-web.png)

## Robot Workflow

This robotic system allows user to customize their own workflow to perform a particular protocol on various cell culture process. The sequence diagram shows the general workflow for one particular cell culture process.

![](/assets/images/mito-workflow.drawio.png)

This work flow consists of following steps:

1. User logs into the system.
2. User inputs the information and requirements of the cell to be culcured. (e.g. Cell type, desired confluency, etc.)
3. System will generate a workflow for the specific task defined by user.
4. When user send the request to start cell culture process, the system will follow each step on the workflow.
5. During each step, system will perform a self-inspection of the current cell.
6. If the cell is ready system will terminate the task.
7. Finally System will send the message to user indicating the cell culcture is finished.
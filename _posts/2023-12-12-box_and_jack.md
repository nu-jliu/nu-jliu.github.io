---
layout: post
title:  "Jack and Box Simulation"
categories: [ Python, SymPy, Dynamics ]
image: assets/images/jack_and_box.gif
featured: false
hidden: false
---

Python, SymPy, Dynamics

**Authors**: Allen Liu

**GitHub**: [View this Project on GitHub](https://github.com/nu-jliu/MECH_ENG_314/blob/main/Final%20Project/final_project_allen.ipynb)

# Project Description
Used Jupyter notebook to perform the calculation about physics model of a jack with a box with some force applied upon the box.
# Amination
The result of the jack and box simulation can be shown in the video below

<iframe width="560" height="315" src="https://www.youtube.com/embed/fi4AyBE95MQ?si=xvtY0axu523nGuCj" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

# Structure

## Rigit Body Transformation

To model the dynamics about the jack and the box, we defined all necessary frames as shown in figure below:

![](/assets/images/frames_def.jpg)

Then we can calculate the transformation between all frames:

![](/assets/images/frames.jpg)

## Euler-Language Equation Formulation

In this project, to simplify the problem, we model the jack as 4 point mass with same mass, $m_j$, and model the box with the mass $m_b$ and moment of intertia of $I_b$, so that the total kinetic energy and potential energy can be easily obtained by this 

$$
\begin{align*}
 I &= \frac{1}{3}ML^2 \\
 I^{**} &= 
\begin{bmatrix}
    M & 0 & 0 & 0 & 0 & 0 \\
    0 & M & 0 & 0 & 0 & 0 \\
    0 & 0 & M & 0 & 0 & 0 \\
    0 & 0 & 0 & 0 & 0 & 0 \\
    0 & 0 & 0 & 0 & 0 & 0 \\
    0 & 0 & 0 & 0 & 0 & {\cal I} \\
\end{bmatrix} \\
V^b &= \check{\left( g^{-1} \dot{g} \right)} \\
K &= \sum_i{V_{ib}^T I_i^{**}V_i^b} \\
P &= \sum_i{ m_igh_i }\\
L &= K - P

\end{align*}
$$



## Impacts
The impact of the jack and box can be modeled by impact equations

$$
\begin{align*}
P \big |^{\tau_+}_{\tau_-} &= \lambda \Delta \phi\\
{\cal H} \big |^{\tau_+}_{\tau_-} &= 0 \\
{\cal H} &= \frac{d {\cal L}}{\dot{q}} \cdot \dot{q} - {\cal L}

\end{align*}
$$

Finally by solving all equations listed above, we can simulate the dynamics of jack wihin a box.

<!-- <iframe width="560" height="315" src="https://www.youtube.com/embed/QBnimOgBjeg?si=DBGshXhhqxGaSYix" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>



# Challenges
 - *Solver algorithm*: When first implementing the algorithm for two solvers, it was difficult for us to understand the concept for the solver so we spent most of time drawing the process on a paper to visualize it. After we had a clear concept about what it was it was a smooth process for all of us. -->
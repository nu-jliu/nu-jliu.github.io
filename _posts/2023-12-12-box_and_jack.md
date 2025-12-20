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

Physics-based simulation of a jack-in-the-box system using Lagrangian mechanics and impact dynamics. The project models the coupled dynamics of a spring-loaded jack mechanism inside a box, including collision detection and impulse-based contact resolution.

## System Overview

```mermaid
graph TB
    subgraph Model["Physical System"]
        JACK[Jack Mechanism<br/>4 Point Masses]
        BOX[Box<br/>Rigid Body]
        SPRING[Spring Force]
        GRAVITY[Gravitational Force]
    end

    subgraph Simulation["Simulation Engine"]
        LAGRANGE[Lagrangian Formulation<br/>Kinetic & Potential Energy]
        EOM[Equations of Motion<br/>Euler-Lagrange]
        IMPACT[Impact Detection<br/>& Resolution]
    end

    subgraph Computation["SymPy + Python"]
        SYMBOLIC[Symbolic Math<br/>SymPy]
        NUMERIC[Numerical Integration<br/>SciPy ODE Solver]
        VIS[Visualization<br/>Matplotlib Animation]
    end

    JACK --> LAGRANGE
    BOX --> LAGRANGE
    SPRING --> LAGRANGE
    GRAVITY --> LAGRANGE

    LAGRANGE --> EOM
    EOM --> IMPACT
    IMPACT --> NUMERIC

    EOM --> SYMBOLIC
    SYMBOLIC --> NUMERIC
    NUMERIC --> VIS

    style LAGRANGE fill:#e1f5ff
    style IMPACT fill:#fff4e1
    style VIS fill:#d4edda
```
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



## Impact Dynamics

The collision between jack and box is resolved using impulse-momentum equations.

```mermaid
flowchart TD
    START([Time Integration]) --> DETECT{Contact<br/>Detected?}

    DETECT -->|No| INTEGRATE[Continue Integration<br/>EOM]
    INTEGRATE --> START

    DETECT -->|Yes| COMPUTE_VEL[Compute Pre-Impact<br/>Velocities]
    COMPUTE_VEL --> IMPULSE[Calculate Impulse<br/>λ Δφ]
    IMPULSE --> UPDATE_VEL[Update Post-Impact<br/>Velocities]
    UPDATE_VEL --> CONSERVE[Verify Energy<br/>Constraint]
    CONSERVE --> INTEGRATE

    style DETECT fill:#fff4e1
    style IMPULSE fill:#e1f5ff
    style CONSERVE fill:#d4edda
```

**Impact Equations:**

$$
\begin{align*}
P \big |^{\tau_+}_{\tau_-} &= \lambda \Delta \phi \quad \text{(Momentum jump)}\\
{\cal H} \big |^{\tau_+}_{\tau_-} &= 0 \quad \text{(Hamiltonian conservation)}\\
{\cal H} &= \frac{d {\cal L}}{\dot{q}} \cdot \dot{q} - {\cal L} \quad \text{(Hamiltonian definition)}
\end{align*}
$$

Where:
- $ P $: Generalized momentum
- $ \lambda $: Impact impulse magnitude
- $ \Delta \phi $: Contact constraint gradient
- $ {\cal H} $: Hamiltonian (total energy)

By solving these equations, we simulate the complete dynamics of the jack-in-the-box system including realistic collision behavior.

<!-- <iframe width="560" height="315" src="https://www.youtube.com/embed/QBnimOgBjeg?si=DBGshXhhqxGaSYix" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>



# Challenges
 - *Solver algorithm*: When first implementing the algorithm for two solvers, it was difficult for us to understand the concept for the solver so we spent most of time drawing the process on a paper to visualize it. After we had a clear concept about what it was it was a smooth process for all of us. -->
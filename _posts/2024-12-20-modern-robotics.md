---
layout: post
title:  "Modern Robotics Library in Rust and C++"
title_zh: "现代机器人学 Rust 和 C++ 库"
subtitle: "Comprehensive implementations of robotics algorithms from the Modern Robotics textbook"
subtitle_zh: "基于《现代机器人学》教材的完整机器人算法实现"
excerpt_zh: "用 Rust 和 C++ 实现《现代机器人学：机构、规划与控制》教材中的核心算法库。"
categories: [ Rust, C++, Robotics, Kinematics, Dynamics, Trajectory Planning, Control, Linear Algebra ]
image: assets/images/modern_robotics.svg
featured: false
hidden: false
---

<div class="content-en" markdown="1">

Rust, C++, Robotics, Kinematics, Dynamics, Trajectory Planning, Control, Linear Algebra

**Author**: Allen Liu

[Rust Library on GitHub](https://github.com/nu-jliu/modern-robotics-rs)

[Rust Documentation](https://www.allen-liu.net/modern-robotics-rs/)

[C++ Library on GitHub](https://github.com/nu-jliu/modern-robotics-cpp)

[C++ Documentation](https://www.allen-liu.net/modern-robotics-cpp/)

# Project Overview

This project provides comprehensive implementations of fundamental robotics algorithms in both **Rust** and **C++**, based on the textbook *[Modern Robotics: Mechanics, Planning, and Control](http://hades.mech.northwestern.edu/index.php/Modern_Robotics)* by Kevin M. Lynch and Frank C. Park (2017). These libraries enable roboticists and researchers to perform essential computations for robot kinematics, dynamics, trajectory generation, and control.

**Reference:** [Official Modern Robotics GitHub Repository](https://github.com/NxRLab/ModernRobotics)

The dual-language approach allows developers to choose the implementation that best fits their project requirements:
- **Rust** (`modern-robotics-rs`): Memory-safe, with zero-cost abstractions and modern package management via Cargo
- **C++** (`modern-robotics-cpp`): High-performance with Armadillo linear algebra library, ideal for integration with existing robotics frameworks

# Library Architecture

Both libraries follow the textbook's chapter organization, providing a consistent API across implementations:

```mermaid
graph TB
    subgraph Core["Core Mathematical Foundations"]
        SO3["SO(3) Operations<br/>Rotation Matrices"]
        SE3["SE(3) Operations<br/>Homogeneous Transforms"]
        SCREW["Screw Theory<br/>Twists and Wrenches"]
    end

    subgraph Kinematics["Kinematics Module"]
        FK["Forward Kinematics<br/>Product of Exponentials"]
        IK["Inverse Kinematics<br/>Newton-Raphson"]
        JAC["Jacobian Computation<br/>Body and Space Frame"]
    end

    subgraph Dynamics["Dynamics Module"]
        FD["Forward Dynamics<br/>Joint Accelerations"]
        ID["Inverse Dynamics<br/>Joint Torques"]
        MASS["Mass Matrix<br/>Inertia Computation"]
    end

    subgraph Trajectory["Trajectory Generation"]
        POLY["Polynomial Scaling<br/>Cubic & Quintic"]
        JOINT["Joint Space<br/>Trajectories"]
        CART["Cartesian Space<br/>SE(3) Interpolation"]
    end

    subgraph Control["Control Module"]
        CT["Computed Torque<br/>Model-Based Control"]
        PID["PID Feedback<br/>Error Correction"]
    end

    SO3 --> SE3
    SE3 --> SCREW
    SCREW --> FK
    SCREW --> JAC
    FK --> IK
    JAC --> ID
    JAC --> FD
    ID --> MASS
    FD --> MASS
    POLY --> JOINT
    POLY --> CART
    MASS --> CT
    CT --> PID

    style Core fill:#e1f5ff
    style Kinematics fill:#fff4e1
    style Dynamics fill:#d4edda
    style Trajectory fill:#fce4ec
    style Control fill:#f3e5f5
```

# Mathematical Foundations

## Rigid Body Representations

The libraries implement the mathematical machinery for representing rigid body motions in 3D space:

```mermaid
flowchart LR
    subgraph so3["so(3) - Lie Algebra"]
        OMEGA["ω ∈ ℝ³<br/>Angular Velocity"]
        SKEW["[ω] ∈ so(3)<br/>Skew-Symmetric"]
    end

    subgraph SO3["SO(3) - Rotation Group"]
        R["R ∈ SO(3)<br/>Rotation Matrix"]
        AXIS["(ω̂, θ)<br/>Axis-Angle"]
    end

    subgraph se3["se(3) - Lie Algebra"]
        TWIST["𝒱 ∈ ℝ⁶<br/>Twist"]
        BRACKET["[𝒱] ∈ se(3)<br/>4×4 Matrix"]
    end

    subgraph SE3["SE(3) - Rigid Motion Group"]
        T["T ∈ SE(3)<br/>Transformation"]
        SCREW_AX["(𝒮, θ)<br/>Screw Axis"]
    end

    OMEGA -->|"VecToso3()"| SKEW
    SKEW -->|"so3ToVec()"| OMEGA
    SKEW -->|"MatrixExp3()"| R
    R -->|"MatrixLog3()"| SKEW
    R <-->|"AxisAng3()"| AXIS

    TWIST -->|"VecTose3()"| BRACKET
    BRACKET -->|"se3ToVec()"| TWIST
    BRACKET -->|"MatrixExp6()"| T
    T -->|"MatrixLog6()"| BRACKET
    T <-->|"AxisAng6()"| SCREW_AX

    style so3 fill:#e1f5ff
    style SO3 fill:#fff4e1
    style se3 fill:#d4edda
    style SE3 fill:#fce4ec
```

### Key Mathematical Operations

**Rotation Matrix Exponential (Rodrigues' Formula):**

$$
e^{[\hat{\omega}]\theta} = I + \sin\theta[\hat{\omega}] + (1 - \cos\theta)[\hat{\omega}]^2
$$

**Homogeneous Transformation Exponential:**

$$
e^{[\mathcal{S}]\theta} = \begin{bmatrix} e^{[\omega]\theta} & G(\theta)v \\ 0 & 1 \end{bmatrix}
$$

Where:

$$
G(\theta) = I\theta + (1-\cos\theta)[\omega] + (\theta - \sin\theta)[\omega]^2
$$

# Forward Kinematics

The libraries implement forward kinematics using the Product of Exponentials formula, supporting both body and space frame representations:

```mermaid
flowchart TD
    subgraph Input["Input Parameters"]
        M["M ∈ SE(3)<br/>Home Configuration"]
        SLIST["Screw Axes<br/>{𝒮₁, 𝒮₂, ..., 𝒮ₙ}"]
        THETA["Joint Angles<br/>{θ₁, θ₂, ..., θₙ}"]
    end

    subgraph SpaceFrame["Space Frame FK"]
        EXP_S1["e^{[𝒮₁]θ₁}"]
        EXP_S2["e^{[𝒮₂]θ₂}"]
        EXP_SN["e^{[𝒮ₙ]θₙ}"]
        PROD_S["T = e^{[𝒮₁]θ₁}...e^{[𝒮ₙ]θₙ}M"]
    end

    subgraph BodyFrame["Body Frame FK"]
        EXP_B1["e^{[ℬ₁]θ₁}"]
        EXP_B2["e^{[ℬ₂]θ₂}"]
        EXP_BN["e^{[ℬₙ]θₙ}"]
        PROD_B["T = Me^{[ℬ₁]θ₁}...e^{[ℬₙ]θₙ}"]
    end

    subgraph Output["Output"]
        T_END["T ∈ SE(3)<br/>End-Effector Pose"]
    end

    M --> PROD_S
    M --> PROD_B
    SLIST --> EXP_S1
    SLIST --> EXP_S2
    SLIST --> EXP_SN
    THETA --> EXP_S1
    THETA --> EXP_S2
    THETA --> EXP_SN
    THETA --> EXP_B1
    THETA --> EXP_B2
    THETA --> EXP_BN

    EXP_S1 --> PROD_S
    EXP_S2 --> PROD_S
    EXP_SN --> PROD_S

    EXP_B1 --> PROD_B
    EXP_B2 --> PROD_B
    EXP_BN --> PROD_B

    PROD_S --> T_END
    PROD_B --> T_END

    style Input fill:#e1f5ff
    style SpaceFrame fill:#fff4e1
    style BodyFrame fill:#d4edda
    style Output fill:#fce4ec
```

**Product of Exponentials Formula:**

Space Frame:
$$
T(\theta) = e^{[\mathcal{S}_1]\theta_1} e^{[\mathcal{S}_2]\theta_2} \cdots e^{[\mathcal{S}_n]\theta_n} M
$$

Body Frame:
$$
T(\theta) = M e^{[\mathcal{B}_1]\theta_1} e^{[\mathcal{B}_2]\theta_2} \cdots e^{[\mathcal{B}_n]\theta_n}
$$

# Inverse Kinematics

The inverse kinematics solver uses the Newton-Raphson iterative method to find joint angles for a desired end-effector pose:

```mermaid
flowchart TD
    START[Start] --> INIT["Initialize θ₀<br/>Initial Guess"]
    INIT --> FK["Compute FK<br/>T(θₖ)"]
    FK --> ERROR["Compute Error<br/>𝒱ᵦ = log(T⁻¹(θₖ)T_d)"]
    ERROR --> CHECK{"||ωᵦ|| < εω<br/>AND<br/>||vᵦ|| < εv ?"}
    CHECK -->|Yes| SUCCESS["Return θₖ<br/>Solution Found"]
    CHECK -->|No| JACOBIAN["Compute Jacobian<br/>Jᵦ(θₖ)"]
    JACOBIAN --> UPDATE["Update θ<br/>θₖ₊₁ = θₖ + J⁺ᵦ𝒱ᵦ"]
    UPDATE --> ITER{"k < max_iter ?"}
    ITER -->|Yes| FK
    ITER -->|No| FAIL["Return Failure<br/>No Convergence"]

    style START fill:#e1f5ff
    style SUCCESS fill:#d4edda
    style FAIL fill:#ffcccc
    style CHECK fill:#fff4e1
```

**Newton-Raphson Update:**

$$
\theta_{k+1} = \theta_k + J_b^+(\theta_k) \mathcal{V}_b
$$

Where $ J_b^+ $ is the Moore-Penrose pseudoinverse of the body Jacobian.

# Dynamics

The dynamics module implements both forward and inverse dynamics for open-chain robots:

```mermaid
flowchart LR
    subgraph Inverse["Inverse Dynamics"]
        direction TB
        ID_IN["θ, θ̇, θ̈"]
        ID_PROC["Newton-Euler<br/>Algorithm"]
        ID_OUT["τ (Joint Torques)"]
        ID_IN --> ID_PROC --> ID_OUT
    end

    subgraph Forward["Forward Dynamics"]
        direction TB
        FD_IN["θ, θ̇, τ"]
        FD_PROC["Articulated Body<br/>Algorithm"]
        FD_OUT["θ̈ (Accelerations)"]
        FD_IN --> FD_PROC --> FD_OUT
    end

    subgraph MassMatrix["Mass Matrix"]
        direction TB
        MM_IN["θ"]
        MM_PROC["Column-by-Column<br/>Computation"]
        MM_OUT["M(θ)"]
        MM_IN --> MM_PROC --> MM_OUT
    end

    style Inverse fill:#e1f5ff
    style Forward fill:#fff4e1
    style MassMatrix fill:#d4edda
```

**Equations of Motion:**

$$
\tau = M(\theta)\ddot{\theta} + c(\theta, \dot{\theta}) + g(\theta)
$$

Where:
- $ M(\theta) $ is the mass matrix
- $ c(\theta, \dot{\theta}) $ represents Coriolis and centrifugal terms
- $ g(\theta) $ is the gravity vector

# Trajectory Generation

The libraries support multiple trajectory generation methods:

```mermaid
flowchart TB
    subgraph TimeScaling["Time Scaling Functions"]
        CUBIC["Cubic Polynomial<br/>s(t) = 3t² - 2t³"]
        QUINTIC["Quintic Polynomial<br/>s(t) = 10t³ - 15t⁴ + 6t⁵"]
    end

    subgraph JointSpace["Joint Space Trajectory"]
        JS_START["θ_start"]
        JS_END["θ_end"]
        JS_INTERP["θ(s) = θ_start + s(θ_end - θ_start)"]
    end

    subgraph CartesianSpace["Cartesian Space Trajectory"]
        SCREW_TRAJ["Screw Trajectory<br/>SE(3) Interpolation"]
        DECOUPLED["Decoupled Trajectory<br/>R(s), p(s) separate"]
    end

    CUBIC --> JS_INTERP
    QUINTIC --> JS_INTERP
    CUBIC --> SCREW_TRAJ
    QUINTIC --> SCREW_TRAJ
    CUBIC --> DECOUPLED
    QUINTIC --> DECOUPLED

    JS_START --> JS_INTERP
    JS_END --> JS_INTERP

    style TimeScaling fill:#e1f5ff
    style JointSpace fill:#fff4e1
    style CartesianSpace fill:#d4edda
```

**Quintic Time Scaling (Zero Velocity and Acceleration at Endpoints):**

$$
s(t) = 10\left(\frac{t}{T}\right)^3 - 15\left(\frac{t}{T}\right)^4 + 6\left(\frac{t}{T}\right)^5
$$

# Computed Torque Control

The control module implements computed torque control with PID feedback:

```mermaid
flowchart LR
    subgraph Reference["Reference"]
        TRAJ_REF["θ_d, θ̇_d, θ̈_d"]
    end

    subgraph Feedback["Feedback Controller"]
        ERROR_CALC["Error Calculation<br/>e = θ_d - θ"]
        PID_CTRL["PID Controller<br/>K_p·e + K_i∫e + K_d·ė"]
    end

    subgraph Feedforward["Feedforward"]
        DYNAMICS["Inverse Dynamics<br/>M(θ)θ̈_d + c + g"]
    end

    subgraph Plant["Robot"]
        ROBOT["Robot Dynamics<br/>τ → θ̈"]
    end

    TRAJ_REF --> ERROR_CALC
    TRAJ_REF --> DYNAMICS

    ERROR_CALC --> PID_CTRL
    PID_CTRL --> SUM((+))
    DYNAMICS --> SUM

    SUM -->|"τ"| ROBOT
    ROBOT -->|"θ, θ̇"| ERROR_CALC

    style Reference fill:#e1f5ff
    style Feedback fill:#fff4e1
    style Feedforward fill:#d4edda
    style Plant fill:#fce4ec
```

**Computed Torque Control Law:**

$$
\tau = M(\theta)\left(\ddot{\theta}_d + K_p e + K_i \int e \, dt + K_d \dot{e}\right) + c(\theta, \dot{\theta}) + g(\theta)
$$

# API Comparison

| Feature | Rust (`modern-robotics-rs`) | C++ (`modern-robotics-cpp`) |
|---------|----------------------------|----------------------------|
| **Linear Algebra** | nalgebra | Armadillo |
| **Namespace** | `modern_robotics` | `mr` |
| **Matrix Types** | `DVector`, `DMatrix` | `arma::vec`, `arma::mat` |
| **Documentation** | Rust Docs | Doxygen |
| **Testing** | Rust built-in tests | Catch2 |
| **Package Manager** | Cargo | CMake |
| **Tolerance** | Configurable | 1e-6 global |

## Code Examples

### Rust Implementation

```rust
use modern_robotics::{FKinSpace, JacobianSpace};
use nalgebra::{DMatrix, DVector};

// Define screw axes and home configuration
let s_list = DMatrix::from_row_slice(6, 3, &[
    0.0, 0.0, 0.0,  // S1
    0.0, 1.0, 1.0,  // S2
    1.0, 0.0, 0.0,  // S3
    0.0, 0.0, 0.0,  // S4
    0.0, 0.0, 1.0,  // S5
    0.0, 0.0, 0.0,  // S6
]);

let theta = DVector::from_vec(vec![0.1, 0.2, 0.3]);

// Compute forward kinematics
let t_end = FKinSpace(&m, &s_list, &theta);

// Compute Jacobian
let jacobian = JacobianSpace(&s_list, &theta);
```

### C++ Implementation

{% raw %}
```cpp
#include <modern_robotics/modern_robotics.hpp>

// Define screw axes and home configuration
arma::mat Slist = {{0, 0, 0, 0, 0, 0},
                   {0, 1, 1, 0, 0, 0},
                   {1, 0, 0, 0, 0, 1}};
Slist = Slist.t();

arma::vec theta = {0.1, 0.2, 0.3};

// Compute forward kinematics
arma::mat T_end = mr::FKinSpace(M, Slist, theta);

// Compute Jacobian
arma::mat Jacobian = mr::JacobianSpace(Slist, theta);
```
{% endraw %}

# Technical Requirements

## Rust Library

| Component | Requirement |
|-----------|-------------|
| **Rust Edition** | 2021 |
| **Dependencies** | nalgebra 0.34.0, assert_float_eq 1.1.4 |
| **Documentation** | Generated via `cargo doc` |

## C++ Library

| Component | Minimum | Tested |
|-----------|---------|--------|
| **OS** | Ubuntu 22.04+ | Ubuntu 22.04.5 LTS |
| **CMake** | 3.16+ | 3.22.1 |
| **Compiler** | GCC 9+ / Clang 10+ | GCC 11.4.0 |
| **Armadillo** | 9.900+ | 10.8.2 |

# Function Reference

## Rigid-Body Motions (Chapter 3)

| Function | Description |
|----------|-------------|
| `RotInv` | Inverse of rotation matrix |
| `VecToso3` | Convert 3-vector to so(3) matrix |
| `so3ToVec` | Convert so(3) to 3-vector |
| `AxisAng3` | Extract axis-angle from exponential coordinates |
| `MatrixExp3` | Matrix exponential for SO(3) |
| `MatrixLog3` | Matrix logarithm for SO(3) |
| `RpToTrans` | Rotation + position to SE(3) |
| `TransToRp` | SE(3) to rotation + position |
| `TransInv` | Inverse of transformation matrix |
| `VecTose3` | Convert 6-vector to se(3) |
| `se3ToVec` | Convert se(3) to 6-vector |
| `Adjoint` | Adjoint representation |
| `MatrixExp6` | Matrix exponential for SE(3) |
| `MatrixLog6` | Matrix logarithm for SE(3) |

## Kinematics (Chapters 4-6)

| Function | Description |
|----------|-------------|
| `FKinBody` | Forward kinematics (body frame) |
| `FKinSpace` | Forward kinematics (space frame) |
| `JacobianBody` | Body Jacobian |
| `JacobianSpace` | Space Jacobian |
| `IKinBody` | Inverse kinematics (body frame) |
| `IKinSpace` | Inverse kinematics (space frame) |

## Dynamics (Chapter 8)

| Function | Description |
|----------|-------------|
| `MassMatrix` | Compute mass matrix M(θ) |
| `VelQuadraticForces` | Coriolis and centrifugal terms |
| `GravityForces` | Gravity force vector |
| `EndEffectorForces` | End-effector force to joint torques |
| `ForwardDynamics` | θ̈ from θ, θ̇, τ |
| `InverseDynamics` | τ from θ, θ̇, θ̈ |

## Trajectory (Chapter 9)

| Function | Description |
|----------|-------------|
| `CubicTimeScaling` | Cubic polynomial s(t) |
| `QuinticTimeScaling` | Quintic polynomial s(t) |
| `JointTrajectory` | Joint space trajectory |
| `ScrewTrajectory` | SE(3) screw interpolation |
| `CartesianTrajectory` | Decoupled Cartesian trajectory |

## Control (Chapter 11)

| Function | Description |
|----------|-------------|
| `ComputedTorque` | Computed torque control |
| `SimulateControl` | Closed-loop simulation |

# License

Both libraries are released under the **MIT License**.

</div>

<div class="content-zh" markdown="1">

Rust, C++, 机器人学, 运动学, 动力学, 轨迹规划, 控制, 线性代数

**作者**: Allen Liu

[C++ 库 GitHub](https://github.com/nu-jliu/modern-robotics-cpp)

[C++ 文档](https://www.allen-liu.net/modern-robotics-cpp/)

[Rust 库 GitHub](https://github.com/nu-jliu/modern-robotics-rs) 

[Rust 文档](https://www.allen-liu.net/modern-robotics-rs/) 

# 项目概述

本项目提供了基于 Kevin M. Lynch 和 Frank C. Park 所著教材《[现代机器人学：机构、规划与控制](http://hades.mech.northwestern.edu/index.php/Modern_Robotics)》(2017) 的 **Rust** 和 **C++** 双语言实现。这些库使机器人研究人员能够执行机器人运动学、动力学、轨迹生成和控制的基本计算。

**参考:** [官方 Modern Robotics GitHub 仓库](https://github.com/NxRLab/ModernRobotics)

双语言方法允许开发者选择最适合其项目需求的实现：
- **Rust** (`modern-robotics-rs`): 内存安全，零成本抽象，通过 Cargo 进行现代包管理
- **C++** (`modern-robotics-cpp`): 高性能，使用 Armadillo 线性代数库，便于与现有机器人框架集成

# 库架构

两个库都遵循教材的章节组织，提供跨实现的一致 API：

```mermaid
graph TB
    subgraph Core["核心数学基础"]
        SO3["SO(3) 运算<br/>旋转矩阵"]
        SE3["SE(3) 运算<br/>齐次变换"]
        SCREW["旋量理论<br/>速度旋量与力旋量"]
    end

    subgraph Kinematics["运动学模块"]
        FK["正运动学<br/>指数积公式"]
        IK["逆运动学<br/>Newton-Raphson"]
        JAC["雅可比计算<br/>本体坐标系与空间坐标系"]
    end

    subgraph Dynamics["动力学模块"]
        FD["正动力学<br/>关节加速度"]
        ID["逆动力学<br/>关节力矩"]
        MASS["质量矩阵<br/>惯性计算"]
    end

    subgraph Trajectory["轨迹生成"]
        POLY["多项式时间缩放<br/>三次与五次"]
        JOINT["关节空间<br/>轨迹"]
        CART["笛卡尔空间<br/>SE(3) 插值"]
    end

    subgraph Control["控制模块"]
        CT["计算力矩<br/>基于模型的控制"]
        PID["PID 反馈<br/>误差校正"]
    end

    SO3 --> SE3
    SE3 --> SCREW
    SCREW --> FK
    SCREW --> JAC
    FK --> IK
    JAC --> ID
    JAC --> FD
    ID --> MASS
    FD --> MASS
    POLY --> JOINT
    POLY --> CART
    MASS --> CT
    CT --> PID

    style Core fill:#e1f5ff
    style Kinematics fill:#fff4e1
    style Dynamics fill:#d4edda
    style Trajectory fill:#fce4ec
    style Control fill:#f3e5f5
```

# 数学基础

## 刚体表示

这些库实现了在三维空间中表示刚体运动的数学工具：

```mermaid
flowchart LR
    subgraph so3["so(3) - 李代数"]
        OMEGA["ω ∈ ℝ³<br/>角速度"]
        SKEW["[ω] ∈ so(3)<br/>反对称矩阵"]
    end

    subgraph SO3["SO(3) - 旋转群"]
        R["R ∈ SO(3)<br/>旋转矩阵"]
        AXIS["(ω̂, θ)<br/>轴角"]
    end

    subgraph se3["se(3) - 李代数"]
        TWIST["𝒱 ∈ ℝ⁶<br/>速度旋量"]
        BRACKET["[𝒱] ∈ se(3)<br/>4×4 矩阵"]
    end

    subgraph SE3["SE(3) - 刚体运动群"]
        T["T ∈ SE(3)<br/>变换矩阵"]
        SCREW_AX["(𝒮, θ)<br/>螺旋轴"]
    end

    OMEGA -->|"VecToso3()"| SKEW
    SKEW -->|"so3ToVec()"| OMEGA
    SKEW -->|"MatrixExp3()"| R
    R -->|"MatrixLog3()"| SKEW
    R <-->|"AxisAng3()"| AXIS

    TWIST -->|"VecTose3()"| BRACKET
    BRACKET -->|"se3ToVec()"| TWIST
    BRACKET -->|"MatrixExp6()"| T
    T -->|"MatrixLog6()"| BRACKET
    T <-->|"AxisAng6()"| SCREW_AX

    style so3 fill:#e1f5ff
    style SO3 fill:#fff4e1
    style se3 fill:#d4edda
    style SE3 fill:#fce4ec
```

**旋转矩阵指数（罗德里格斯公式）：**

$$
e^{[\hat{\omega}]\theta} = I + \sin\theta[\hat{\omega}] + (1 - \cos\theta)[\hat{\omega}]^2
$$

**齐次变换矩阵指数：**

$$
e^{[\mathcal{S}]\theta} = \begin{bmatrix} e^{[\omega]\theta} & G(\theta)v \\ 0 & 1 \end{bmatrix}
$$

# 正运动学

库使用指数积公式实现正运动学，支持本体坐标系和空间坐标系两种表示：

```mermaid
flowchart TD
    subgraph Input["输入参数"]
        M["M ∈ SE(3)<br/>初始位形"]
        SLIST["螺旋轴<br/>{𝒮₁, 𝒮₂, ..., 𝒮ₙ}"]
        THETA["关节角度<br/>{θ₁, θ₂, ..., θₙ}"]
    end

    subgraph SpaceFrame["空间坐标系正运动学"]
        EXP_S1["e^{[𝒮₁]θ₁}"]
        EXP_S2["e^{[𝒮₂]θ₂}"]
        EXP_SN["e^{[𝒮ₙ]θₙ}"]
        PROD_S["T = e^{[𝒮₁]θ₁}...e^{[𝒮ₙ]θₙ}M"]
    end

    subgraph BodyFrame["本体坐标系正运动学"]
        EXP_B1["e^{[ℬ₁]θ₁}"]
        EXP_B2["e^{[ℬ₂]θ₂}"]
        EXP_BN["e^{[ℬₙ]θₙ}"]
        PROD_B["T = Me^{[ℬ₁]θ₁}...e^{[ℬₙ]θₙ}"]
    end

    subgraph Output["输出"]
        T_END["T ∈ SE(3)<br/>末端执行器位姿"]
    end

    M --> PROD_S
    M --> PROD_B
    SLIST --> EXP_S1
    SLIST --> EXP_S2
    SLIST --> EXP_SN
    THETA --> EXP_S1
    THETA --> EXP_S2
    THETA --> EXP_SN
    THETA --> EXP_B1
    THETA --> EXP_B2
    THETA --> EXP_BN

    EXP_S1 --> PROD_S
    EXP_S2 --> PROD_S
    EXP_SN --> PROD_S

    EXP_B1 --> PROD_B
    EXP_B2 --> PROD_B
    EXP_BN --> PROD_B

    PROD_S --> T_END
    PROD_B --> T_END

    style Input fill:#e1f5ff
    style SpaceFrame fill:#fff4e1
    style BodyFrame fill:#d4edda
    style Output fill:#fce4ec
```

**指数积公式：**

空间坐标系：
$$
T(\theta) = e^{[\mathcal{S}_1]\theta_1} e^{[\mathcal{S}_2]\theta_2} \cdots e^{[\mathcal{S}_n]\theta_n} M
$$

本体坐标系：
$$
T(\theta) = M e^{[\mathcal{B}_1]\theta_1} e^{[\mathcal{B}_2]\theta_2} \cdots e^{[\mathcal{B}_n]\theta_n}
$$

# 逆运动学

逆运动学求解器使用 Newton-Raphson 迭代方法为期望的末端执行器位姿找到关节角度：

```mermaid
flowchart TD
    START[开始] --> INIT["初始化 θ₀<br/>初始猜测"]
    INIT --> FK["计算正运动学<br/>T(θₖ)"]
    FK --> ERROR["计算误差<br/>𝒱ᵦ = log(T⁻¹(θₖ)T_d)"]
    ERROR --> CHECK{"||ωᵦ|| < εω<br/>且<br/>||vᵦ|| < εv ?"}
    CHECK -->|是| SUCCESS["返回 θₖ<br/>找到解"]
    CHECK -->|否| JACOBIAN["计算雅可比<br/>Jᵦ(θₖ)"]
    JACOBIAN --> UPDATE["更新 θ<br/>θₖ₊₁ = θₖ + J⁺ᵦ𝒱ᵦ"]
    UPDATE --> ITER{"k < 最大迭代次数 ?"}
    ITER -->|是| FK
    ITER -->|否| FAIL["返回失败<br/>未收敛"]

    style START fill:#e1f5ff
    style SUCCESS fill:#d4edda
    style FAIL fill:#ffcccc
    style CHECK fill:#fff4e1
```

**Newton-Raphson 更新：**

$$
\theta_{k+1} = \theta_k + J_b^+(\theta_k) \mathcal{V}_b
$$

其中 $ J_b^+ $ 是本体雅可比矩阵的 Moore-Penrose 伪逆。

# 动力学

动力学模块为开链机器人实现正动力学和逆动力学：

```mermaid
flowchart LR
    subgraph Inverse["逆动力学"]
        direction TB
        ID_IN["θ, θ̇, θ̈"]
        ID_PROC["Newton-Euler<br/>算法"]
        ID_OUT["τ (关节力矩)"]
        ID_IN --> ID_PROC --> ID_OUT
    end

    subgraph Forward["正动力学"]
        direction TB
        FD_IN["θ, θ̇, τ"]
        FD_PROC["铰接体<br/>算法"]
        FD_OUT["θ̈ (加速度)"]
        FD_IN --> FD_PROC --> FD_OUT
    end

    subgraph MassMatrix["质量矩阵"]
        direction TB
        MM_IN["θ"]
        MM_PROC["逐列<br/>计算"]
        MM_OUT["M(θ)"]
        MM_IN --> MM_PROC --> MM_OUT
    end

    style Inverse fill:#e1f5ff
    style Forward fill:#fff4e1
    style MassMatrix fill:#d4edda
```

**运动方程：**

$$
\tau = M(\theta)\ddot{\theta} + c(\theta, \dot{\theta}) + g(\theta)
$$

其中：
- $ M(\theta) $ 是质量矩阵
- $ c(\theta, \dot{\theta}) $ 表示科里奥利力和离心力项
- $ g(\theta) $ 是重力向量

# 轨迹生成

库支持多种轨迹生成方法：

```mermaid
flowchart TB
    subgraph TimeScaling["时间缩放函数"]
        CUBIC["三次多项式<br/>s(t) = 3t² - 2t³"]
        QUINTIC["五次多项式<br/>s(t) = 10t³ - 15t⁴ + 6t⁵"]
    end

    subgraph JointSpace["关节空间轨迹"]
        JS_START["θ_start"]
        JS_END["θ_end"]
        JS_INTERP["θ(s) = θ_start + s(θ_end - θ_start)"]
    end

    subgraph CartesianSpace["笛卡尔空间轨迹"]
        SCREW_TRAJ["螺旋轨迹<br/>SE(3) 插值"]
        DECOUPLED["解耦轨迹<br/>R(s), p(s) 分离"]
    end

    CUBIC --> JS_INTERP
    QUINTIC --> JS_INTERP
    CUBIC --> SCREW_TRAJ
    QUINTIC --> SCREW_TRAJ
    CUBIC --> DECOUPLED
    QUINTIC --> DECOUPLED

    JS_START --> JS_INTERP
    JS_END --> JS_INTERP

    style TimeScaling fill:#e1f5ff
    style JointSpace fill:#fff4e1
    style CartesianSpace fill:#d4edda
```

**五次时间缩放（端点处零速度和零加速度）：**

$$
s(t) = 10\left(\frac{t}{T}\right)^3 - 15\left(\frac{t}{T}\right)^4 + 6\left(\frac{t}{T}\right)^5
$$

# 计算力矩控制

控制模块实现带 PID 反馈的计算力矩控制：

```mermaid
flowchart LR
    subgraph Reference["参考"]
        TRAJ_REF["θ_d, θ̇_d, θ̈_d"]
    end

    subgraph Feedback["反馈控制器"]
        ERROR_CALC["误差计算<br/>e = θ_d - θ"]
        PID_CTRL["PID 控制器<br/>K_p·e + K_i∫e + K_d·ė"]
    end

    subgraph Feedforward["前馈"]
        DYNAMICS["逆动力学<br/>M(θ)θ̈_d + c + g"]
    end

    subgraph Plant["机器人"]
        ROBOT["机器人动力学<br/>τ → θ̈"]
    end

    TRAJ_REF --> ERROR_CALC
    TRAJ_REF --> DYNAMICS

    ERROR_CALC --> PID_CTRL
    PID_CTRL --> SUM((+))
    DYNAMICS --> SUM

    SUM -->|"τ"| ROBOT
    ROBOT -->|"θ, θ̇"| ERROR_CALC

    style Reference fill:#e1f5ff
    style Feedback fill:#fff4e1
    style Feedforward fill:#d4edda
    style Plant fill:#fce4ec
```

**计算力矩控制律：**

$$
\tau = M(\theta)\left(\ddot{\theta}_d + K_p e + K_i \int e \, dt + K_d \dot{e}\right) + c(\theta, \dot{\theta}) + g(\theta)
$$

# API 比较

| 功能 | Rust (`modern-robotics-rs`) | C++ (`modern-robotics-cpp`) |
|------|----------------------------|----------------------------|
| **线性代数** | nalgebra | Armadillo |
| **命名空间** | `modern_robotics` | `mr` |
| **矩阵类型** | `DVector`, `DMatrix` | `arma::vec`, `arma::mat` |
| **文档** | Rust Docs | Doxygen |
| **测试** | Rust 内置测试 | Catch2 |
| **包管理器** | Cargo | CMake |
| **容差** | 可配置 | 1e-6 全局 |

# 技术要求

## Rust 库

| 组件 | 要求 |
|------|------|
| **Rust 版本** | 2021 |
| **依赖** | nalgebra 0.34.0, assert_float_eq 1.1.4 |
| **文档** | 通过 `cargo doc` 生成 |

## C++ 库

| 组件 | 最低要求 | 测试版本 |
|------|---------|---------|
| **操作系统** | Ubuntu 22.04+ | Ubuntu 22.04.5 LTS |
| **CMake** | 3.16+ | 3.22.1 |
| **编译器** | GCC 9+ / Clang 10+ | GCC 11.4.0 |
| **Armadillo** | 9.900+ | 10.8.2 |

# 许可证

两个库均在 **MIT 许可证** 下发布。

</div>

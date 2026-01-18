---
layout: post
title: "Kitchen Kit - Android Kitchen Inventory Management App"
title_zh: "Kitchen Kit - Android 厨房库存管理应用"
subtitle: "Android mobile app for kitchen inventory management and recipe discovery"
subtitle_zh: "用于厨房库存管理和食谱发现的Android移动应用"
excerpt_zh: "一款帮助用户管理厨房库存并根据现有食材发现食谱的 Android 移动应用程序。"
categories: [Android, Kotlin, Firebase, Firestore, Authentication, CRUD, Mobile Development]
image: https://firebasestorage.googleapis.com/v0/b/rosestarter-project-vault.appspot.com/o/projects%2F-MAICjhDGHc3d17uDZ1c%2Fprimary?alt=media&token=89e4843a-67b5-40b7-b1cf-dc36c4f2fdf5
featured: false
hidden: false
---

<div class="content-en" markdown="1">

Android, Kotlin, Firebase, Firestore, Authentication, CRUD, Mobile Development

[View This Project on GitHub](https://github.com/nu-jliu/CSSE483_Team_Project)

[Figma Design](https://www.figma.com/design/zLoVGME063NUiGjuXjQFZ7/Kitchen-Kit) | [Project Documentation](https://docs.google.com/document/d/1dXJyXBQQhVCJyxOmel_rmhNG07zNHCaK0wcTT7sSRu8/edit)

# Project Description

Kitchen Kit is an Android mobile application designed to help users manage their kitchen inventory and discover recipes based on available ingredients. Built as a team project for CSSE483 (Android Application Development) at Rose-Hulman Institute of Technology, the app provides a comprehensive solution for tracking ingredients, browsing recipes, and maintaining personalized favorites.

The application leverages Firebase for cloud-based data synchronization, enabling users to access their kitchen inventory across multiple devices in real-time.

**Team Members:** Allen Liu, Ray Fang

# System Architecture

```mermaid
graph TB
    subgraph Android["Android Application<br/>Kotlin"]
        UI["User Interface<br/>Fragments + RecyclerView"]
        LOGIC["Business Logic<br/>ViewModels + Adapters"]
        AUTH["Firebase Auth<br/>User Management"]
    end

    subgraph Firebase["Firebase Backend"]
        FIRESTORE["Cloud Firestore<br/>NoSQL Database"]
        STORAGE["Firebase Storage<br/>Image Files"]
        FAUTH["Authentication<br/>Email/Password"]
    end

    subgraph Data["Data Models"]
        INGREDIENT["Ingredient<br/>Name, Quantity, Expiry"]
        RECIPE["Recipe<br/>Title, Instructions, Image"]
        PROFILE["User Profile<br/>Preferences, Favorites"]
    end

    UI --> LOGIC
    LOGIC --> AUTH
    AUTH --> FAUTH
    LOGIC --> FIRESTORE
    LOGIC --> STORAGE
    INGREDIENT --> FIRESTORE
    RECIPE --> FIRESTORE
    PROFILE --> FIRESTORE

    style UI fill:#e1f5ff
    style FIRESTORE fill:#fff4e1
    style FAUTH fill:#d4edda
```

# Application Features

```mermaid
flowchart TD
    START([Launch App]) --> SPLASH[Splash Screen]
    SPLASH --> AUTH{Authenticated?}

    AUTH -->|No| LOGIN[Login / Register]
    AUTH -->|Yes| MAIN[Main Navigation]
    LOGIN --> MAIN

    MAIN --> INGREDIENTS[My Ingredients]
    MAIN --> RECIPES[Recipe Browser]
    MAIN --> PROFILE[User Profile]

    subgraph IngredientMgmt["Ingredient Management"]
        INGREDIENTS --> VIEW_ING[View All Ingredients]
        INGREDIENTS --> ADD_ING[Add New Ingredient]
        INGREDIENTS --> EDIT_ING[Edit Ingredient]
        ADD_ING --> SAVE_ING[Save to Firestore]
        EDIT_ING --> SAVE_ING
    end

    subgraph RecipeMgmt["Recipe Features"]
        RECIPES --> BROWSE[Browse Recipes]
        BROWSE --> DETAIL[View Recipe Details]
        DETAIL --> FAVORITE[Add to Favorites]
    end

    subgraph ProfileMgmt["Profile Features"]
        PROFILE --> VIEW_PROFILE[View Profile]
        PROFILE --> EDIT_PROFILE[Edit Profile]
        PROFILE --> FAVORITES[My Favorites]
    end

    style SPLASH fill:#e1f5ff
    style MAIN fill:#fff4e1
    style SAVE_ING fill:#d4edda
    style FAVORITE fill:#d4edda
```

**Key Features:**

- **Ingredient Tracking**: Add, edit, and delete kitchen ingredients with details like name, quantity, and expiration date
- **Recipe Browser**: Discover recipes with detailed instructions and ingredient lists
- **User Authentication**: Secure login and registration via Firebase Authentication
- **Favorites System**: Save favorite recipes for quick access
- **Cloud Sync**: Real-time data synchronization across devices via Firestore
- **Image Support**: Upload and display photos for recipes and ingredients
- **User Profiles**: Personalized user profiles with customizable settings

# Technical Implementation

## Module Architecture

```mermaid
graph TB
    subgraph App["KitchenKit Application"]
        MAIN["MainActivity.kt<br/>Navigation Host"]
        SPLASH["SplashFragment.kt<br/>App Entry Point"]
        UTILS["Utils.kt / Constants.kt<br/>Helpers"]
    end

    subgraph Ingredient["ingredient/"]
        ING_MODEL["Ingredient.kt<br/>Data Model"]
        ING_STORED["StoredIngredient.kt<br/>Firestore Model"]
        ING_LIST["MyIngredientsFragment.kt<br/>List View"]
        ING_ADD["AddIngredientFragment.kt<br/>Create"]
        ING_EDIT["EditIngredientFragment.kt<br/>Update"]
        ING_ADAPTER["IngredientsAdapter.kt<br/>RecyclerView"]
        ING_VH["IngredientsViewHolder.kt<br/>Item View"]
    end

    subgraph Recipe["recipe/"]
        REC_MODEL["Recipe.kt<br/>Data Model"]
        REC_BROWSER["RecipeBrowserFragment.kt<br/>Browse"]
        REC_DETAIL["RecipeDetailFragment.kt<br/>Details"]
        REC_ADAPTER["RecipeAdapter.kt<br/>RecyclerView"]
        REC_VH["RecipeViewHolder.kt<br/>Item View"]
    end

    subgraph Profile["profile/"]
        PRO_FRAG["ProfileFragment.kt<br/>View Profile"]
        PRO_EDIT["EditProfileFragment.kt<br/>Edit"]
        PRO_INFO["Information.kt<br/>Data Model"]
        FAV_ADAPTER["FavoritesAdapter.kt<br/>Favorites List"]
        FAV_VH["FavoritesViewHolder.kt<br/>Item View"]
    end

    MAIN --> SPLASH
    SPLASH --> ING_LIST
    SPLASH --> REC_BROWSER
    SPLASH --> PRO_FRAG

    ING_LIST --> ING_ADAPTER
    ING_ADAPTER --> ING_VH
    ING_LIST --> ING_ADD
    ING_LIST --> ING_EDIT

    REC_BROWSER --> REC_ADAPTER
    REC_ADAPTER --> REC_VH
    REC_BROWSER --> REC_DETAIL

    PRO_FRAG --> PRO_EDIT
    PRO_FRAG --> FAV_ADAPTER
    FAV_ADAPTER --> FAV_VH

    style MAIN fill:#e1f5ff
    style ING_MODEL fill:#fff4e1
    style REC_MODEL fill:#fff4e1
    style PRO_INFO fill:#fff4e1
```

## CRUD Operations

The application implements full CRUD (Create, Read, Update, Delete) operations for ingredients:

| Operation | Component | Firebase Method |
|-----------|-----------|-----------------|
| **Create** | AddIngredientFragment | `collection.add()` |
| **Read** | MyIngredientsFragment | `collection.get()` with listeners |
| **Update** | EditIngredientFragment | `document.update()` |
| **Delete** | IngredientsAdapter | `document.delete()` |

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Fragment as Fragment/UI
    participant Adapter as Adapter
    participant Firestore as Cloud Firestore

    User->>Fragment: Add New Ingredient
    Fragment->>Fragment: Validate Input
    Fragment->>Firestore: collection("ingredients").add(data)
    Firestore-->>Fragment: Success Callback
    Fragment->>Adapter: notifyDataSetChanged()
    Adapter-->>User: Display Updated List

    Note over User,Firestore: Real-time Sync
    Firestore-->>Fragment: onSnapshot() Update
    Fragment->>Adapter: Update Data
    Adapter-->>User: Refresh UI
```

# Demo

<iframe width="560" height="315" src="https://www.youtube.com/embed/3pT0qUzxewI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

# Technical Stack

```mermaid
graph TB
    subgraph Core["Core Technologies"]
        KOTLIN["Kotlin<br/>Primary Language"]
        ANDROID["Android SDK<br/>Target API 29+"]
        GRADLE["Gradle<br/>Build System"]
    end

    subgraph Firebase["Firebase Services"]
        FAUTH["Authentication<br/>User Management"]
        FSTORE["Cloud Firestore<br/>NoSQL Database"]
        FSTORAGE["Cloud Storage<br/>File Storage"]
    end

    subgraph UI["UI Components"]
        RECYCLER["RecyclerView<br/>List Display"]
        FRAGMENTS["Fragments<br/>Screen Navigation"]
        MATERIAL["Material Design<br/>UI Components"]
    end

    KOTLIN --> ANDROID
    ANDROID --> GRADLE
    ANDROID --> Firebase
    ANDROID --> UI

    style KOTLIN fill:#7f52ff,color:#fff
    style FSTORE fill:#ffca28
    style MATERIAL fill:#e1f5ff
```

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Language** | Kotlin | Primary development language (99.2% of codebase) |
| **Platform** | Android | Native mobile application |
| **Build System** | Gradle | Dependency management and build automation |
| **Database** | Cloud Firestore | Real-time NoSQL cloud database |
| **Authentication** | Firebase Auth | User login and registration |
| **Storage** | Firebase Storage | Image and file storage |
| **UI Pattern** | Fragment + RecyclerView | Modern Android UI architecture |
| **Design** | Material Design | Google's design system for Android |

# Project Structure

```
KitchenKit/
├── app/
│   └── src/main/java/edu/rosehulman/fangr/kitchenkit/
│       ├── MainActivity.kt           # Main entry point
│       ├── SplashFragment.kt          # Splash screen
│       ├── Constants.kt               # App constants
│       ├── Utils.kt                   # Utility functions
│       ├── BitmapUtils.kt             # Image processing
│       ├── ingredient/
│       │   ├── Ingredient.kt          # Ingredient model
│       │   ├── StoredIngredient.kt    # Firestore model
│       │   ├── MyIngredientsFragment.kt
│       │   ├── AddIngredientFragment.kt
│       │   ├── EditIngredientFragment.kt
│       │   ├── IngredientsAdapter.kt
│       │   └── IngredientsViewHolder.kt
│       ├── recipe/
│       │   ├── Recipe.kt              # Recipe model
│       │   ├── RecipeBrowserFragment.kt
│       │   ├── RecipeDetailFragment.kt
│       │   ├── RecipeAdapter.kt
│       │   └── RecipeViewHolder.kt
│       └── profile/
│           ├── Information.kt         # User info model
│           ├── ProfileFragment.kt
│           ├── EditProfileFragment.kt
│           ├── FavoritesAdapter.kt
│           └── FavoritesViewHolder.kt
├── build.gradle
└── README.md
```

</div>

<div class="content-zh" markdown="1">

Android, Kotlin, Firebase, Firestore, 身份验证, CRUD, 移动开发

[在 GitHub 上查看此项目](https://github.com/nu-jliu/CSSE483_Team_Project)

[Figma 设计](https://www.figma.com/design/zLoVGME063NUiGjuXjQFZ7/Kitchen-Kit) | [项目文档](https://docs.google.com/document/d/1dXJyXBQQhVCJyxOmel_rmhNG07zNHCaK0wcTT7sSRu8/edit)

# 项目描述

Kitchen Kit 是一款 Android 移动应用程序，旨在帮助用户管理厨房库存并根据现有食材发现食谱。该应用作为罗斯-霍尔曼理工学院 CSSE483（Android 应用开发）课程的团队项目开发，为跟踪食材、浏览食谱和维护个性化收藏提供了全面的解决方案。

该应用程序利用 Firebase 进行基于云的数据同步，使用户能够在多个设备上实时访问其厨房库存。

**团队成员：** Allen Liu, Ray Fang

# 应用功能

**主要功能：**

- **食材追踪**：添加、编辑和删除厨房食材，包括名称、数量和过期日期等详细信息
- **食谱浏览器**：发现带有详细说明和食材清单的食谱
- **用户身份验证**：通过 Firebase Authentication 进行安全登录和注册
- **收藏系统**：保存喜爱的食谱以便快速访问
- **云同步**：通过 Firestore 实现跨设备实时数据同步
- **图片支持**：上传和显示食谱和食材的照片
- **用户资料**：个性化用户资料和可自定义设置

# 演示

<iframe width="560" height="315" src="https://www.youtube.com/embed/3pT0qUzxewI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

# 技术栈

| 组件 | 技术 | 用途 |
|-----------|------------|---------|
| **编程语言** | Kotlin | 主要开发语言（占代码库的 99.2%）|
| **平台** | Android | 原生移动应用 |
| **构建系统** | Gradle | 依赖管理和构建自动化 |
| **数据库** | Cloud Firestore | 实时 NoSQL 云数据库 |
| **身份验证** | Firebase Auth | 用户登录和注册 |
| **存储** | Firebase Storage | 图片和文件存储 |
| **UI 模式** | Fragment + RecyclerView | 现代 Android UI 架构 |
| **设计** | Material Design | Google 的 Android 设计系统 |

</div>

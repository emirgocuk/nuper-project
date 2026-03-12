# c4-architecture
Source: https://antigravity.codes/agent-skills/architecture/c4-architecture

## AI Worker Instructions
When the user requests functionality related to c4-architecture, follow these guidelines and utilize this context.

## Scraped Content

# c4-architecture
```
C4Context  title System Context - Workout Tracker  Person(user, "User", "Tracks workouts and exercises")  System(app, "Workout Tracker", "Vue PWA for tracking strength and CrossFit workouts")  System_Ext(browser, "Web Browser", "Stores data in IndexedDB")  Rel(user, app, "Uses")  Rel(app, browser, "Persists data to", "IndexedDB")
```
```
C4Context  title System Context - Workout Tracker  Person(user, "User", "Tracks workouts and exercises")  System(app, "Workout Tracker", "Vue PWA for tracking strength and CrossFit workouts")  System_Ext(browser, "Web Browser", "Stores data in IndexedDB")  Rel(user, app, "Uses")  Rel(app, browser, "Persists data to", "IndexedDB")
```
```
C4Container  title Container Diagram - Workout Tracker  Person(user, "User", "Tracks workouts")  Container_Boundary(app, "Workout Tracker PWA") {    Container(spa, "SPA", "Vue 3, TypeScript", "Single-page application")    Container(pinia, "State Management", "Pinia", "Manages application state")    ContainerDb(indexeddb, "IndexedDB", "Dexie", "Local workout storage")  }  Rel(user, spa, "Uses")  Rel(spa, pinia, "Reads/writes state")  Rel(pinia, indexeddb, "Persists", "Dexie ORM")
```
```
C4Container  title Container Diagram - Workout Tracker  Person(user, "User", "Tracks workouts")  Container_Boundary(app, "Workout Tracker PWA") {    Container(spa, "SPA", "Vue 3, TypeScript", "Single-page application")    Container(pinia, "State Management", "Pinia", "Manages application state")    ContainerDb(indexeddb, "IndexedDB", "Dexie", "Local workout storage")  }  Rel(user, spa, "Uses")  Rel(spa, pinia, "Reads/writes state")  Rel(pinia, indexeddb, "Persists", "Dexie ORM")
```
```
C4Component  title Component Diagram - Workout Feature  Container(views, "Views", "Vue Router pages")  Container_Boundary(workout, "Workout Feature") {    Component(useWorkout, "useWorkout", "Composable", "Workout execution state")    Component(useTimer, "useTimer", "Composable", "Timer state machine")    Component(workoutRepo, "WorkoutRepository", "Dexie", "Workout persistence")  }  Rel(views, useWorkout, "Uses")  Rel(useWorkout, useTimer, "Controls")  Rel(useWorkout, workoutRepo, "Saves to")
```
```
C4Component  title Component Diagram - Workout Feature  Container(views, "Views", "Vue Router pages")  Container_Boundary(workout, "Workout Feature") {    Component(useWorkout, "useWorkout", "Composable", "Workout execution state")    Component(useTimer, "useTimer", "Composable", "Timer state machine")    Component(workoutRepo, "WorkoutRepository", "Dexie", "Workout persistence")  }  Rel(views, useWorkout, "Uses")  Rel(useWorkout, useTimer, "Controls")  Rel(useWorkout, workoutRepo, "Saves to")
```
```
C4Dynamic  title Dynamic Diagram - User Sign In Flow  ContainerDb(db, "Database", "PostgreSQL", "User credentials")  Container(spa, "Single-Page App", "React", "Banking UI")  Container_Boundary(api, "API Application") {    Component(signIn, "Sign In Controller", "Express", "Auth endpoint")    Component(security, "Security Service", "JWT", "Validates credentials")  }  Rel(spa, signIn, "1. Submit credentials", "JSON/HTTPS")  Rel(signIn, security, "2. Validate")  Rel(security, db, "3. Query user", "SQL")  UpdateRelStyle(spa, signIn, $textColor="blue", $offsetY="-30")
```
```
C4Dynamic  title Dynamic Diagram - User Sign In Flow  ContainerDb(db, "Database", "PostgreSQL", "User credentials")  Container(spa, "Single-Page App", "React", "Banking UI")  Container_Boundary(api, "API Application") {    Component(signIn, "Sign In Controller", "Express", "Auth endpoint")    Component(security, "Security Service", "JWT", "Validates credentials")  }  Rel(spa, signIn, "1. Submit credentials", "JSON/HTTPS")  Rel(signIn, security, "2. Validate")  Rel(security, db, "3. Query user", "SQL")  UpdateRelStyle(spa, signIn, $textColor="blue", $offsetY="-30")
```
```
C4Deployment  title Deployment Diagram - Production  Deployment_Node(browser, "Customer Browser", "Chrome/Firefox") {    Container(spa, "SPA", "React", "Web application")  }  Deployment_Node(aws, "AWS Cloud", "us-east-1") {    Deployment_Node(ecs, "ECS Cluster", "Fargate") {      Container(api, "API Service", "Node.js", "REST API")    }    Deployment_Node(rds, "RDS", "db.r5.large") {      ContainerDb(db, "Database", "PostgreSQL", "Application data")    }  }  Rel(spa, api, "API calls", "HTTPS")  Rel(api, db, "Reads/writes", "JDBC")
```
```
C4Deployment  title Deployment Diagram - Production  Deployment_Node(browser, "Customer Browser", "Chrome/Firefox") {    Container(spa, "SPA", "React", "Web application")  }  Deployment_Node(aws, "AWS Cloud", "us-east-1") {    Deployment_Node(ecs, "ECS Cluster", "Fargate") {      Container(api, "API Service", "Node.js", "REST API")    }    Deployment_Node(rds, "RDS", "db.r5.large") {      ContainerDb(db, "Database", "PostgreSQL", "Application data")    }  }  Rel(spa, api, "API calls", "HTTPS")  Rel(api, db, "Reads/writes", "JDBC")
```
```
Person(alias, "Label", "Description")Person_Ext(alias, "Label", "Description")       # External personSystem(alias, "Label", "Description")System_Ext(alias, "Label", "Description")       # External systemSystemDb(alias, "Label", "Description")         # Database systemSystemQueue(alias, "Label", "Description")      # Queue system
```
```
Person(alias, "Label", "Description")Person_Ext(alias, "Label", "Description")       # External personSystem(alias, "Label", "Description")System_Ext(alias, "Label", "Description")       # External systemSystemDb(alias, "Label", "Description")         # Database systemSystemQueue(alias, "Label", "Description")      # Queue system
```
```
Container(alias, "Label", "Technology", "Description")Container_Ext(alias, "Label", "Technology", "Description")ContainerDb(alias, "Label", "Technology", "Description")ContainerQueue(alias, "Label", "Technology", "Description")
```
```
Container(alias, "Label", "Technology", "Description")Container_Ext(alias, "Label", "Technology", "Description")ContainerDb(alias, "Label", "Technology", "Description")ContainerQueue(alias, "Label", "Technology", "Description")
```
```
Component(alias, "Label", "Technology", "Description")Component_Ext(alias, "Label", "Technology", "Description")ComponentDb(alias, "Label", "Technology", "Description")
```
```
Component(alias, "Label", "Technology", "Description")Component_Ext(alias, "Label", "Technology", "Description")ComponentDb(alias, "Label", "Technology", "Description")
```
```
Enterprise_Boundary(alias, "Label") { ... }System_Boundary(alias, "Label") { ... }Container_Boundary(alias, "Label") { ... }Boundary(alias, "Label", "type") { ... }
```
```
Enterprise_Boundary(alias, "Label") { ... }System_Boundary(alias, "Label") { ... }Container_Boundary(alias, "Label") { ... }Boundary(alias, "Label", "type") { ... }
```
```
Rel(from, to, "Label")Rel(from, to, "Label", "Technology")BiRel(from, to, "Label")                        # BidirectionalRel_U(from, to, "Label")                        # UpwardRel_D(from, to, "Label")                        # DownwardRel_L(from, to, "Label")                        # LeftwardRel_R(from, to, "Label")                        # Rightward
```
```
Rel(from, to, "Label")Rel(from, to, "Label", "Technology")BiRel(from, to, "Label")                        # BidirectionalRel_U(from, to, "Label")                        # UpwardRel_D(from, to, "Label")                        # DownwardRel_L(from, to, "Label")                        # LeftwardRel_R(from, to, "Label")                        # Rightward
```
```
Deployment_Node(alias, "Label", "Type", "Description") { ... }Node(alias, "Label", "Type", "Description") { ... }  # Shorthand
```
```
Deployment_Node(alias, "Label", "Type", "Description") { ... }Node(alias, "Label", "Type", "Description") { ... }  # Shorthand
```
```
UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```
```
UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```
```
$c4ShapeInRow
```
```
$c4BoundaryInRow
```
```
UpdateElementStyle(alias, $fontColor="red", $bgColor="grey", $borderColor="red")
```
```
UpdateElementStyle(alias, $fontColor="red", $bgColor="grey", $borderColor="red")
```
```
UpdateRelStyle(from, to, $textColor="blue", $lineColor="blue", $offsetX="5", $offsetY="-10")
```
```
UpdateRelStyle(from, to, $textColor="blue", $lineColor="blue", $offsetX="5", $offsetY="-10")
```
```
$offsetX
```
```
$offsetY
```
```
orderService
```
```
s1
```
```
C4Container  title Microservices - Single Team  System_Boundary(platform, "E-commerce Platform") {    Container(orderApi, "Order Service", "Spring Boot", "Order processing")    ContainerDb(orderDb, "Order DB", "PostgreSQL", "Order data")    Container(inventoryApi, "Inventory Service", "Node.js", "Stock management")    ContainerDb(inventoryDb, "Inventory DB", "MongoDB", "Stock data")  }
```
```
C4Container  title Microservices - Single Team  System_Boundary(platform, "E-commerce Platform") {    Container(orderApi, "Order Service", "Spring Boot", "Order processing")    ContainerDb(orderDb, "Order DB", "PostgreSQL", "Order data")    Container(inventoryApi, "Inventory Service", "Node.js", "Stock management")    ContainerDb(inventoryDb, "Inventory DB", "MongoDB", "Stock data")  }
```
```
C4Context  title Microservices - Multi-Team  Person(customer, "Customer", "Places orders")  System(orderSystem, "Order System", "Team Alpha")  System(inventorySystem, "Inventory System", "Team Beta")  System(paymentSystem, "Payment System", "Team Gamma")  Rel(customer, orderSystem, "Places orders")  Rel(orderSystem, inventorySystem, "Checks stock")  Rel(orderSystem, paymentSystem, "Processes payment")
```
```
C4Context  title Microservices - Multi-Team  Person(customer, "Customer", "Places orders")  System(orderSystem, "Order System", "Team Alpha")  System(inventorySystem, "Inventory System", "Team Beta")  System(paymentSystem, "Payment System", "Team Gamma")  Rel(customer, orderSystem, "Places orders")  Rel(orderSystem, inventorySystem, "Checks stock")  Rel(orderSystem, paymentSystem, "Processes payment")
```
```
C4Container  title Event-Driven Architecture  Container(orderService, "Order Service", "Java", "Creates orders")  Container(stockService, "Stock Service", "Java", "Manages inventory")  ContainerQueue(orderTopic, "order.created", "Kafka", "Order events")  ContainerQueue(stockTopic, "stock.reserved", "Kafka", "Stock events")  Rel(orderService, orderTopic, "Publishes to")  Rel(stockService, orderTopic, "Subscribes to")  Rel(stockService, stockTopic, "Publishes to")  Rel(orderService, stockTopic, "Subscribes to")
```
```
C4Container  title Event-Driven Architecture  Container(orderService, "Order Service", "Java", "Creates orders")  Container(stockService, "Stock Service", "Java", "Manages inventory")  ContainerQueue(orderTopic, "order.created", "Kafka", "Order events")  ContainerQueue(stockTopic, "stock.reserved", "Kafka", "Stock events")  Rel(orderService, orderTopic, "Publishes to")  Rel(stockService, orderTopic, "Subscribes to")  Rel(stockService, stockTopic, "Publishes to")  Rel(orderService, stockTopic, "Subscribes to")
```
```
docs/architecture/
```
```
c4-context.md
```
```
c4-containers.md
```
```
c4-components-{feature}.md
```
```
c4-deployment.md
```
```
c4-dynamic-{flow}.md
```
Understanding complex software systems is crucial for any development team. This powerful agent skill streamlines the creation of clear, standardized architecture documentation using the acclaimed C4 model, rendered in Mermaid syntax. It empowers you to visualize your system's structure at various abstraction levels, from high-level context to detailed component views. By automating diagram generation, this skill ensures consistency, reduces manual effort, and fosters better communication among stakeholders, making it an invaluable tool for both new projects and refactoring existing ones.

# When to Use This Skill
- •Onboarding new team members by providing clear, standardized system architecture overviews.
- •Presenting system architecture to non-technical stakeholders or management for easy comprehension.
- •Documenting changes and impact during a refactoring effort or new feature development.
- •Facilitating design discussions by visualizing dependencies between services and components.

# Pro Tips
- 💡Specify the exact C4 level (e.g., 'Generate a C4 Context diagram for...') to ensure the output is tailored to your audience's needs.
- 💡Provide a concise description of key components, their responsibilities, and main interactions for more accurate and detailed diagrams.
- 💡After generation, use online Mermaid editors or IDE extensions to quickly preview and fine-tune the diagrams before embedding them in your documentation.


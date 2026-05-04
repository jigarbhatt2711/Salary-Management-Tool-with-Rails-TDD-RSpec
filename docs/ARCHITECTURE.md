# Architecture Overview

## System Architecture
The Salary Management Tool is developed using a microservices architecture, enhancing modularity and allowing for independent deployment of various components. Each service communicates with each other over RESTful APIs.

## Design Patterns
1. **MVC (Model-View-Controller)**: This architectural pattern is utilized to separate application logic into three interconnected components. The model manages the data, the view displays the data, and the controller handles input.
2. **Service Object Pattern**: This pattern abstracts complex business logic into separate service objects, promoting code reuse and separation of concerns.
3. **Repository Pattern**: Used to encapsulate data access logic, allowing for cleaner and more manageable code when retrieving and storing data.

## Technical Decisions
- **Framework**: Ruby on Rails was chosen for rapid development and ease of use.
- **Testing**: RSpec is used for testing, adhering to TDD (Test-Driven Development) principles to ensure quality and reliability.
- **Database**: SQLite was selected for its robustness and support for advanced SQL features.

This document will continue to evolve as new technical decisions are made and the architecture of the system progresses.

# api-design-principles
Source: https://antigravity.codes/agent-skills/architecture/api-design-principles

## AI Worker Instructions
When the user requests functionality related to api-design-principles, follow these guidelines and utilize this context.

## Scraped Content

# api-design-principles
```
GET
```
```
POST
```
```
PUT
```
```
PATCH
```
```
DELETE
```
```
/api/v1/users/api/v2/users
```
```
/api/v1/users/api/v2/users
```
```
Accept: application/vnd.api+json; version=1
```
```
Accept: application/vnd.api+json; version=1
```
```
/api/users?version=1
```
```
/api/users?version=1
```
```
# Good: Resource-oriented endpointsGET    /api/users              # List users (with pagination)POST   /api/users              # Create userGET    /api/users/{id}         # Get specific userPUT    /api/users/{id}         # Replace userPATCH  /api/users/{id}         # Update user fieldsDELETE /api/users/{id}         # Delete user# Nested resourcesGET    /api/users/{id}/orders  # Get user's ordersPOST   /api/users/{id}/orders  # Create order for user# Bad: Action-oriented endpoints (avoid)POST   /api/createUserPOST   /api/getUserByIdPOST   /api/deleteUser
```
```
# Good: Resource-oriented endpointsGET    /api/users              # List users (with pagination)POST   /api/users              # Create userGET    /api/users/{id}         # Get specific userPUT    /api/users/{id}         # Replace userPATCH  /api/users/{id}         # Update user fieldsDELETE /api/users/{id}         # Delete user# Nested resourcesGET    /api/users/{id}/orders  # Get user's ordersPOST   /api/users/{id}/orders  # Create order for user# Bad: Action-oriented endpoints (avoid)POST   /api/createUserPOST   /api/getUserByIdPOST   /api/deleteUser
```
```
from typing import List, Optionalfrom pydantic import BaseModel, Fieldclass PaginationParams(BaseModel):    page: int = Field(1, ge=1, description="Page number")    page_size: int = Field(20, ge=1, le=100, description="Items per page")class FilterParams(BaseModel):    status: Optional[str] = None    created_after: Optional[str] = None    search: Optional[str] = Noneclass PaginatedResponse(BaseModel):    items: List[dict]    total: int    page: int    page_size: int    pages: int    @property    def has_next(self) -> bool:        return self.page < self.pages    @property    def has_prev(self) -> bool:        return self.page > 1# FastAPI endpoint examplefrom fastapi import FastAPI, Query, Dependsapp = FastAPI()@app.get("/api/users", response_model=PaginatedResponse)async def list_users(    page: int = Query(1, ge=1),    page_size: int = Query(20, ge=1, le=100),    status: Optional[str] = Query(None),    search: Optional[str] = Query(None)):    # Apply filters    query = build_query(status=status, search=search)    # Count total    total = await count_users(query)    # Fetch page    offset = (page - 1) * page_size    users = await fetch_users(query, limit=page_size, offset=offset)    return PaginatedResponse(        items=users,        total=total,        page=page,        page_size=page_size,        pages=(total + page_size - 1) // page_size    )
```
```
from typing import List, Optionalfrom pydantic import BaseModel, Fieldclass PaginationParams(BaseModel):    page: int = Field(1, ge=1, description="Page number")    page_size: int = Field(20, ge=1, le=100, description="Items per page")class FilterParams(BaseModel):    status: Optional[str] = None    created_after: Optional[str] = None    search: Optional[str] = Noneclass PaginatedResponse(BaseModel):    items: List[dict]    total: int    page: int    page_size: int    pages: int    @property    def has_next(self) -> bool:        return self.page < self.pages    @property    def has_prev(self) -> bool:        return self.page > 1# FastAPI endpoint examplefrom fastapi import FastAPI, Query, Dependsapp = FastAPI()@app.get("/api/users", response_model=PaginatedResponse)async def list_users(    page: int = Query(1, ge=1),    page_size: int = Query(20, ge=1, le=100),    status: Optional[str] = Query(None),    search: Optional[str] = Query(None)):    # Apply filters    query = build_query(status=status, search=search)    # Count total    total = await count_users(query)    # Fetch page    offset = (page - 1) * page_size    users = await fetch_users(query, limit=page_size, offset=offset)    return PaginatedResponse(        items=users,        total=total,        page=page,        page_size=page_size,        pages=(total + page_size - 1) // page_size    )
```
```
from fastapi import HTTPException, statusfrom pydantic import BaseModelclass ErrorResponse(BaseModel):    error: str    message: str    details: Optional[dict] = None    timestamp: str    path: strclass ValidationErrorDetail(BaseModel):    field: str    message: str    value: Any# Consistent error responsesSTATUS_CODES = {    "success": 200,    "created": 201,    "no_content": 204,    "bad_request": 400,    "unauthorized": 401,    "forbidden": 403,    "not_found": 404,    "conflict": 409,    "unprocessable": 422,    "internal_error": 500}def raise_not_found(resource: str, id: str):    raise HTTPException(        status_code=status.HTTP_404_NOT_FOUND,        detail={            "error": "NotFound",            "message": f"{resource} not found",            "details": {"id": id}        }    )def raise_validation_error(errors: List[ValidationErrorDetail]):    raise HTTPException(        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,        detail={            "error": "ValidationError",            "message": "Request validation failed",            "details": {"errors": [e.dict() for e in errors]}        }    )# Example usage@app.get("/api/users/{user_id}")async def get_user(user_id: str):    user = await fetch_user(user_id)    if not user:        raise_not_found("User", user_id)    return user
```
```
from fastapi import HTTPException, statusfrom pydantic import BaseModelclass ErrorResponse(BaseModel):    error: str    message: str    details: Optional[dict] = None    timestamp: str    path: strclass ValidationErrorDetail(BaseModel):    field: str    message: str    value: Any# Consistent error responsesSTATUS_CODES = {    "success": 200,    "created": 201,    "no_content": 204,    "bad_request": 400,    "unauthorized": 401,    "forbidden": 403,    "not_found": 404,    "conflict": 409,    "unprocessable": 422,    "internal_error": 500}def raise_not_found(resource: str, id: str):    raise HTTPException(        status_code=status.HTTP_404_NOT_FOUND,        detail={            "error": "NotFound",            "message": f"{resource} not found",            "details": {"id": id}        }    )def raise_validation_error(errors: List[ValidationErrorDetail]):    raise HTTPException(        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,        detail={            "error": "ValidationError",            "message": "Request validation failed",            "details": {"errors": [e.dict() for e in errors]}        }    )# Example usage@app.get("/api/users/{user_id}")async def get_user(user_id: str):    user = await fetch_user(user_id)    if not user:        raise_not_found("User", user_id)    return user
```
```
class UserResponse(BaseModel):    id: str    name: str    email: str    _links: dict    @classmethod    def from_user(cls, user: User, base_url: str):        return cls(            id=user.id,            name=user.name,            email=user.email,            _links={                "self": {"href": f"{base_url}/api/users/{user.id}"},                "orders": {"href": f"{base_url}/api/users/{user.id}/orders"},                "update": {                    "href": f"{base_url}/api/users/{user.id}",                    "method": "PATCH"                },                "delete": {                    "href": f"{base_url}/api/users/{user.id}",                    "method": "DELETE"                }            }        )
```
```
class UserResponse(BaseModel):    id: str    name: str    email: str    _links: dict    @classmethod    def from_user(cls, user: User, base_url: str):        return cls(            id=user.id,            name=user.name,            email=user.email,            _links={                "self": {"href": f"{base_url}/api/users/{user.id}"},                "orders": {"href": f"{base_url}/api/users/{user.id}/orders"},                "update": {                    "href": f"{base_url}/api/users/{user.id}",                    "method": "PATCH"                },                "delete": {                    "href": f"{base_url}/api/users/{user.id}",                    "method": "DELETE"                }            }        )
```
```
# schema.graphql# Clear type definitionstype User {  id: ID!  email: String!  name: String!  createdAt: DateTime!  # Relationships  orders(first: Int = 20, after: String, status: OrderStatus): OrderConnection!  profile: UserProfile}type Order {  id: ID!  status: OrderStatus!  total: Money!  items: [OrderItem!]!  createdAt: DateTime!  # Back-reference  user: User!}# Pagination pattern (Relay-style)type OrderConnection {  edges: [OrderEdge!]!  pageInfo: PageInfo!  totalCount: Int!}type OrderEdge {  node: Order!  cursor: String!}type PageInfo {  hasNextPage: Boolean!  hasPreviousPage: Boolean!  startCursor: String  endCursor: String}# Enums for type safetyenum OrderStatus {  PENDING  CONFIRMED  SHIPPED  DELIVERED  CANCELLED}# Custom scalarsscalar DateTimescalar Money# Query roottype Query {  user(id: ID!): User  users(first: Int = 20, after: String, search: String): UserConnection!  order(id: ID!): Order}# Mutation roottype Mutation {  createUser(input: CreateUserInput!): CreateUserPayload!  updateUser(input: UpdateUserInput!): UpdateUserPayload!  deleteUser(id: ID!): DeleteUserPayload!  createOrder(input: CreateOrderInput!): CreateOrderPayload!}# Input types for mutationsinput CreateUserInput {  email: String!  name: String!  password: String!}# Payload types for mutationstype CreateUserPayload {  user: User  errors: [Error!]}type Error {  field: String  message: String!}
```
```
# schema.graphql# Clear type definitionstype User {  id: ID!  email: String!  name: String!  createdAt: DateTime!  # Relationships  orders(first: Int = 20, after: String, status: OrderStatus): OrderConnection!  profile: UserProfile}type Order {  id: ID!  status: OrderStatus!  total: Money!  items: [OrderItem!]!  createdAt: DateTime!  # Back-reference  user: User!}# Pagination pattern (Relay-style)type OrderConnection {  edges: [OrderEdge!]!  pageInfo: PageInfo!  totalCount: Int!}type OrderEdge {  node: Order!  cursor: String!}type PageInfo {  hasNextPage: Boolean!  hasPreviousPage: Boolean!  startCursor: String  endCursor: String}# Enums for type safetyenum OrderStatus {  PENDING  CONFIRMED  SHIPPED  DELIVERED  CANCELLED}# Custom scalarsscalar DateTimescalar Money# Query roottype Query {  user(id: ID!): User  users(first: Int = 20, after: String, search: String): UserConnection!  order(id: ID!): Order}# Mutation roottype Mutation {  createUser(input: CreateUserInput!): CreateUserPayload!  updateUser(input: UpdateUserInput!): UpdateUserPayload!  deleteUser(id: ID!): DeleteUserPayload!  createOrder(input: CreateOrderInput!): CreateOrderPayload!}# Input types for mutationsinput CreateUserInput {  email: String!  name: String!  password: String!}# Payload types for mutationstype CreateUserPayload {  user: User  errors: [Error!]}type Error {  field: String  message: String!}
```
```
from typing import Optional, Listfrom ariadne import QueryType, MutationType, ObjectTypefrom dataclasses import dataclassquery = QueryType()mutation = MutationType()user_type = ObjectType("User")@query.field("user")async def resolve_user(obj, info, id: str) -> Optional[dict]:    """Resolve single user by ID."""    return await fetch_user_by_id(id)@query.field("users")async def resolve_users(    obj,    info,    first: int = 20,    after: Optional[str] = None,    search: Optional[str] = None) -> dict:    """Resolve paginated user list."""    # Decode cursor    offset = decode_cursor(after) if after else 0    # Fetch users    users = await fetch_users(        limit=first + 1,  # Fetch one extra to check hasNextPage        offset=offset,        search=search    )    # Pagination    has_next = len(users) > first    if has_next:        users = users[:first]    edges = [        {            "node": user,            "cursor": encode_cursor(offset + i)        }        for i, user in enumerate(users)    ]    return {        "edges": edges,        "pageInfo": {            "hasNextPage": has_next,            "hasPreviousPage": offset > 0,            "startCursor": edges[0]["cursor"] if edges else None,            "endCursor": edges[-1]["cursor"] if edges else None        },        "totalCount": await count_users(search=search)    }@user_type.field("orders")async def resolve_user_orders(user: dict, info, first: int = 20) -> dict:    """Resolve user's orders (N+1 prevention with DataLoader)."""    # Use DataLoader to batch requests    loader = info.context["loaders"]["orders_by_user"]    orders = await loader.load(user["id"])    return paginate_orders(orders, first)@mutation.field("createUser")async def resolve_create_user(obj, info, input: dict) -> dict:    """Create new user."""    try:        # Validate input        validate_user_input(input)        # Create user        user = await create_user(            email=input["email"],            name=input["name"],            password=hash_password(input["password"])        )        return {            "user": user,            "errors": []        }    except ValidationError as e:        return {            "user": None,            "errors": [{"field": e.field, "message": e.message}]        }
```
```
from typing import Optional, Listfrom ariadne import QueryType, MutationType, ObjectTypefrom dataclasses import dataclassquery = QueryType()mutation = MutationType()user_type = ObjectType("User")@query.field("user")async def resolve_user(obj, info, id: str) -> Optional[dict]:    """Resolve single user by ID."""    return await fetch_user_by_id(id)@query.field("users")async def resolve_users(    obj,    info,    first: int = 20,    after: Optional[str] = None,    search: Optional[str] = None) -> dict:    """Resolve paginated user list."""    # Decode cursor    offset = decode_cursor(after) if after else 0    # Fetch users    users = await fetch_users(        limit=first + 1,  # Fetch one extra to check hasNextPage        offset=offset,        search=search    )    # Pagination    has_next = len(users) > first    if has_next:        users = users[:first]    edges = [        {            "node": user,            "cursor": encode_cursor(offset + i)        }        for i, user in enumerate(users)    ]    return {        "edges": edges,        "pageInfo": {            "hasNextPage": has_next,            "hasPreviousPage": offset > 0,            "startCursor": edges[0]["cursor"] if edges else None,            "endCursor": edges[-1]["cursor"] if edges else None        },        "totalCount": await count_users(search=search)    }@user_type.field("orders")async def resolve_user_orders(user: dict, info, first: int = 20) -> dict:    """Resolve user's orders (N+1 prevention with DataLoader)."""    # Use DataLoader to batch requests    loader = info.context["loaders"]["orders_by_user"]    orders = await loader.load(user["id"])    return paginate_orders(orders, first)@mutation.field("createUser")async def resolve_create_user(obj, info, input: dict) -> dict:    """Create new user."""    try:        # Validate input        validate_user_input(input)        # Create user        user = await create_user(            email=input["email"],            name=input["name"],            password=hash_password(input["password"])        )        return {            "user": user,            "errors": []        }    except ValidationError as e:        return {            "user": None,            "errors": [{"field": e.field, "message": e.message}]        }
```
```
from aiodataloader import DataLoaderfrom typing import List, Optionalclass UserLoader(DataLoader):    """Batch load users by ID."""    async def batch_load_fn(self, user_ids: List[str]) -> List[Optional[dict]]:        """Load multiple users in single query."""        users = await fetch_users_by_ids(user_ids)        # Map results back to input order        user_map = {user["id"]: user for user in users}        return [user_map.get(user_id) for user_id in user_ids]class OrdersByUserLoader(DataLoader):    """Batch load orders by user ID."""    async def batch_load_fn(self, user_ids: List[str]) -> List[List[dict]]:        """Load orders for multiple users in single query."""        orders = await fetch_orders_by_user_ids(user_ids)        # Group orders by user_id        orders_by_user = {}        for order in orders:            user_id = order["user_id"]            if user_id not in orders_by_user:                orders_by_user[user_id] = []            orders_by_user[user_id].append(order)        # Return in input order        return [orders_by_user.get(user_id, []) for user_id in user_ids]# Context setupdef create_context():    return {        "loaders": {            "user": UserLoader(),            "orders_by_user": OrdersByUserLoader()        }    }
```
```
from aiodataloader import DataLoaderfrom typing import List, Optionalclass UserLoader(DataLoader):    """Batch load users by ID."""    async def batch_load_fn(self, user_ids: List[str]) -> List[Optional[dict]]:        """Load multiple users in single query."""        users = await fetch_users_by_ids(user_ids)        # Map results back to input order        user_map = {user["id"]: user for user in users}        return [user_map.get(user_id) for user_id in user_ids]class OrdersByUserLoader(DataLoader):    """Batch load orders by user ID."""    async def batch_load_fn(self, user_ids: List[str]) -> List[List[dict]]:        """Load orders for multiple users in single query."""        orders = await fetch_orders_by_user_ids(user_ids)        # Group orders by user_id        orders_by_user = {}        for order in orders:            user_id = order["user_id"]            if user_id not in orders_by_user:                orders_by_user[user_id] = []            orders_by_user[user_id].append(order)        # Return in input order        return [orders_by_user.get(user_id, []) for user_id in user_ids]# Context setupdef create_context():    return {        "loaders": {            "user": UserLoader(),            "orders_by_user": OrdersByUserLoader()        }    }
```
```
/users
```
```
/user
```
```
@deprecated
```
Unlock the secrets to crafting exceptional APIs that not only function flawlessly but also delight developers and withstand the test of time. This expert AI agent skill guides you through the fundamental philosophies of both RESTful and GraphQL API design, enabling you to make informed architectural decisions. Whether you're starting a new project, refining existing interfaces, or standardizing team practices, leveraging these principles will ensure your APIs are intuitive, robust, and effortlessly scalable, fostering better integration and long-term success for any digital product.

# When to Use This Skill
- •Designing new REST or GraphQL APIs
- •Establishing API design standards for your team
- •Reviewing API specifications before implementation
- •Optimizing APIs for specific use cases (mobile, third-party integrations)

# Pro Tips
- 💡Always design APIs with the consumer in mind; consistent naming, clear error messages, and comprehensive documentation are paramount.
- 💡For REST, strictly adhere to HTTP method semantics and resource-oriented architecture to leverage the web's built-in capabilities for idempotency and caching.
- 💡When using GraphQL, prioritize a well-defined schema as your contract, and consider advanced features like subscriptions and directives for real-time and flexible data access.


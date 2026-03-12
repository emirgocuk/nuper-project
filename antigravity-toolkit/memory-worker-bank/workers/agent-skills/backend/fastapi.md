# fastapi
Source: https://antigravity.codes/agent-skills/backend/fastapi

## AI Worker Instructions
When the user requests functionality related to fastapi, follow these guidelines and utilize this context.

## Scraped Content

# fastapi
```
# Create projectuv init my-apicd my-api# Add dependenciesuv add fastapi[standard] sqlalchemy[asyncio] aiosqlite python-jose[cryptography] passlib[bcrypt]# Run development serveruv run fastapi dev src/main.py
```
```
# Create projectuv init my-apicd my-api# Add dependenciesuv add fastapi[standard] sqlalchemy[asyncio] aiosqlite python-jose[cryptography] passlib[bcrypt]# Run development serveruv run fastapi dev src/main.py
```
```
# src/main.pyfrom fastapi import FastAPIfrom pydantic import BaseModelapp = FastAPI(title="My API")class Item(BaseModel):    name: str    price: float@app.get("/")async def root():    return {"message": "Hello World"}@app.post("/items")async def create_item(item: Item):    return item
```
```
# src/main.pyfrom fastapi import FastAPIfrom pydantic import BaseModelapp = FastAPI(title="My API")class Item(BaseModel):    name: str    price: float@app.get("/")async def root():    return {"message": "Hello World"}@app.post("/items")async def create_item(item: Item):    return item
```
```
uv run fastapi dev src/main.py
```
```
http://127.0.0.1:8000/docs
```
```
my-api/├── pyproject.toml├── src/│   ├── __init__.py│   ├── main.py              # FastAPI app initialization│   ├── config.py            # Global settings│   ├── database.py          # Database connection│   ││   ├── auth/                # Auth domain│   │   ├── __init__.py│   │   ├── router.py        # Auth endpoints│   │   ├── schemas.py       # Pydantic models│   │   ├── models.py        # SQLAlchemy models│   │   ├── service.py       # Business logic│   │   └── dependencies.py  # Auth dependencies│   ││   ├── items/               # Items domain│   │   ├── __init__.py│   │   ├── router.py│   │   ├── schemas.py│   │   ├── models.py│   │   └── service.py│   ││   └── shared/              # Shared utilities│       ├── __init__.py│       └── exceptions.py└── tests/    └── test_main.py
```
```
my-api/├── pyproject.toml├── src/│   ├── __init__.py│   ├── main.py              # FastAPI app initialization│   ├── config.py            # Global settings│   ├── database.py          # Database connection│   ││   ├── auth/                # Auth domain│   │   ├── __init__.py│   │   ├── router.py        # Auth endpoints│   │   ├── schemas.py       # Pydantic models│   │   ├── models.py        # SQLAlchemy models│   │   ├── service.py       # Business logic│   │   └── dependencies.py  # Auth dependencies│   ││   ├── items/               # Items domain│   │   ├── __init__.py│   │   ├── router.py│   │   ├── schemas.py│   │   ├── models.py│   │   └── service.py│   ││   └── shared/              # Shared utilities│       ├── __init__.py│       └── exceptions.py└── tests/    └── test_main.py
```
```
# src/items/schemas.pyfrom pydantic import BaseModel, Field, ConfigDictfrom datetime import datetimefrom enum import Enumclass ItemStatus(str, Enum):    DRAFT = "draft"    PUBLISHED = "published"    ARCHIVED = "archived"class ItemBase(BaseModel):    name: str = Field(..., min_length=1, max_length=100)    description: str | None = Field(None, max_length=500)    price: float = Field(..., gt=0, description="Price must be positive")    status: ItemStatus = ItemStatus.DRAFTclass ItemCreate(ItemBase):    passclass ItemUpdate(BaseModel):    name: str | None = Field(None, min_length=1, max_length=100)    description: str | None = None    price: float | None = Field(None, gt=0)    status: ItemStatus | None = Noneclass ItemResponse(ItemBase):    id: int    created_at: datetime    model_config = ConfigDict(from_attributes=True)
```
```
# src/items/schemas.pyfrom pydantic import BaseModel, Field, ConfigDictfrom datetime import datetimefrom enum import Enumclass ItemStatus(str, Enum):    DRAFT = "draft"    PUBLISHED = "published"    ARCHIVED = "archived"class ItemBase(BaseModel):    name: str = Field(..., min_length=1, max_length=100)    description: str | None = Field(None, max_length=500)    price: float = Field(..., gt=0, description="Price must be positive")    status: ItemStatus = ItemStatus.DRAFTclass ItemCreate(ItemBase):    passclass ItemUpdate(BaseModel):    name: str | None = Field(None, min_length=1, max_length=100)    description: str | None = None    price: float | None = Field(None, gt=0)    status: ItemStatus | None = Noneclass ItemResponse(ItemBase):    id: int    created_at: datetime    model_config = ConfigDict(from_attributes=True)
```
```
Field()
```
```
from_attributes=True
```
```
str | None
```
```
Optional[str]
```
```
# src/items/models.pyfrom sqlalchemy import String, Float, DateTime, Enum as SQLEnumfrom sqlalchemy.orm import Mapped, mapped_columnfrom datetime import datetimefrom src.database import Basefrom src.items.schemas import ItemStatusclass Item(Base):    __tablename__ = "items"    id: Mapped[int] = mapped_column(primary_key=True)    name: Mapped[str] = mapped_column(String(100))    description: Mapped[str | None] = mapped_column(String(500), nullable=True)    price: Mapped[float] = mapped_column(Float)    status: Mapped[ItemStatus] = mapped_column(        SQLEnum(ItemStatus), default=ItemStatus.DRAFT    )    created_at: Mapped[datetime] = mapped_column(        DateTime, default=datetime.utcnow    )
```
```
# src/items/models.pyfrom sqlalchemy import String, Float, DateTime, Enum as SQLEnumfrom sqlalchemy.orm import Mapped, mapped_columnfrom datetime import datetimefrom src.database import Basefrom src.items.schemas import ItemStatusclass Item(Base):    __tablename__ = "items"    id: Mapped[int] = mapped_column(primary_key=True)    name: Mapped[str] = mapped_column(String(100))    description: Mapped[str | None] = mapped_column(String(500), nullable=True)    price: Mapped[float] = mapped_column(Float)    status: Mapped[ItemStatus] = mapped_column(        SQLEnum(ItemStatus), default=ItemStatus.DRAFT    )    created_at: Mapped[datetime] = mapped_column(        DateTime, default=datetime.utcnow    )
```
```
# src/database.pyfrom sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmakerfrom sqlalchemy.orm import DeclarativeBaseDATABASE_URL = "sqlite+aiosqlite:///./database.db"engine = create_async_engine(DATABASE_URL, echo=True)async_session = async_sessionmaker(engine, expire_on_commit=False)class Base(DeclarativeBase):    passasync def get_db():    async with async_session() as session:        try:            yield session            await session.commit()        except Exception:            await session.rollback()            raise
```
```
# src/database.pyfrom sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmakerfrom sqlalchemy.orm import DeclarativeBaseDATABASE_URL = "sqlite+aiosqlite:///./database.db"engine = create_async_engine(DATABASE_URL, echo=True)async_session = async_sessionmaker(engine, expire_on_commit=False)class Base(DeclarativeBase):    passasync def get_db():    async with async_session() as session:        try:            yield session            await session.commit()        except Exception:            await session.rollback()            raise
```
```
# src/items/router.pyfrom fastapi import APIRouter, Depends, HTTPException, statusfrom sqlalchemy.ext.asyncio import AsyncSessionfrom sqlalchemy import selectfrom src.database import get_dbfrom src.items import schemas, modelsrouter = APIRouter(prefix="/items", tags=["items"])@router.get("", response_model=list[schemas.ItemResponse])async def list_items(    skip: int = 0,    limit: int = 100,    db: AsyncSession = Depends(get_db)):    result = await db.execute(        select(models.Item).offset(skip).limit(limit)    )    return result.scalars().all()@router.get("/{item_id}", response_model=schemas.ItemResponse)async def get_item(item_id: int, db: AsyncSession = Depends(get_db)):    result = await db.execute(        select(models.Item).where(models.Item.id == item_id)    )    item = result.scalar_one_or_none()    if not item:        raise HTTPException(status_code=404, detail="Item not found")    return item@router.post("", response_model=schemas.ItemResponse, status_code=status.HTTP_201_CREATED)async def create_item(    item_in: schemas.ItemCreate,    db: AsyncSession = Depends(get_db)):    item = models.Item(**item_in.model_dump())    db.add(item)    await db.commit()    await db.refresh(item)    return item
```
```
# src/items/router.pyfrom fastapi import APIRouter, Depends, HTTPException, statusfrom sqlalchemy.ext.asyncio import AsyncSessionfrom sqlalchemy import selectfrom src.database import get_dbfrom src.items import schemas, modelsrouter = APIRouter(prefix="/items", tags=["items"])@router.get("", response_model=list[schemas.ItemResponse])async def list_items(    skip: int = 0,    limit: int = 100,    db: AsyncSession = Depends(get_db)):    result = await db.execute(        select(models.Item).offset(skip).limit(limit)    )    return result.scalars().all()@router.get("/{item_id}", response_model=schemas.ItemResponse)async def get_item(item_id: int, db: AsyncSession = Depends(get_db)):    result = await db.execute(        select(models.Item).where(models.Item.id == item_id)    )    item = result.scalar_one_or_none()    if not item:        raise HTTPException(status_code=404, detail="Item not found")    return item@router.post("", response_model=schemas.ItemResponse, status_code=status.HTTP_201_CREATED)async def create_item(    item_in: schemas.ItemCreate,    db: AsyncSession = Depends(get_db)):    item = models.Item(**item_in.model_dump())    db.add(item)    await db.commit()    await db.refresh(item)    return item
```
```
# src/main.pyfrom contextlib import asynccontextmanagerfrom fastapi import FastAPIfrom fastapi.middleware.cors import CORSMiddlewarefrom src.database import engine, Basefrom src.items.router import router as items_routerfrom src.auth.router import router as auth_router@asynccontextmanagerasync def lifespan(app: FastAPI):    # Startup: Create tables    async with engine.begin() as conn:        await conn.run_sync(Base.metadata.create_all)    yield    # Shutdown: cleanup if neededapp = FastAPI(title="My API", lifespan=lifespan)# CORS middlewareapp.add_middleware(    CORSMiddleware,    allow_origins=["http://localhost:3000"],  # Your frontend    allow_credentials=True,    allow_methods=["*"],    allow_headers=["*"],)# Include routersapp.include_router(auth_router)app.include_router(items_router)
```
```
# src/main.pyfrom contextlib import asynccontextmanagerfrom fastapi import FastAPIfrom fastapi.middleware.cors import CORSMiddlewarefrom src.database import engine, Basefrom src.items.router import router as items_routerfrom src.auth.router import router as auth_router@asynccontextmanagerasync def lifespan(app: FastAPI):    # Startup: Create tables    async with engine.begin() as conn:        await conn.run_sync(Base.metadata.create_all)    yield    # Shutdown: cleanup if neededapp = FastAPI(title="My API", lifespan=lifespan)# CORS middlewareapp.add_middleware(    CORSMiddleware,    allow_origins=["http://localhost:3000"],  # Your frontend    allow_credentials=True,    allow_methods=["*"],    allow_headers=["*"],)# Include routersapp.include_router(auth_router)app.include_router(items_router)
```
```
# src/auth/schemas.pyfrom pydantic import BaseModel, EmailStrclass UserCreate(BaseModel):    email: EmailStr    password: strclass UserResponse(BaseModel):    id: int    email: str    model_config = ConfigDict(from_attributes=True)class Token(BaseModel):    access_token: str    token_type: str = "bearer"class TokenData(BaseModel):    user_id: int | None = None
```
```
# src/auth/schemas.pyfrom pydantic import BaseModel, EmailStrclass UserCreate(BaseModel):    email: EmailStr    password: strclass UserResponse(BaseModel):    id: int    email: str    model_config = ConfigDict(from_attributes=True)class Token(BaseModel):    access_token: str    token_type: str = "bearer"class TokenData(BaseModel):    user_id: int | None = None
```
```
# src/auth/service.pyfrom datetime import datetime, timedeltafrom jose import JWTError, jwtfrom passlib.context import CryptContextfrom src.config import settingspwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")def hash_password(password: str) -> str:    return pwd_context.hash(password)def verify_password(plain: str, hashed: str) -> bool:    return pwd_context.verify(plain, hashed)def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:    to_encode = data.copy()    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))    to_encode.update({"exp": expire})    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")def decode_token(token: str) -> dict | None:    try:        return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])    except JWTError:        return None
```
```
# src/auth/service.pyfrom datetime import datetime, timedeltafrom jose import JWTError, jwtfrom passlib.context import CryptContextfrom src.config import settingspwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")def hash_password(password: str) -> str:    return pwd_context.hash(password)def verify_password(plain: str, hashed: str) -> bool:    return pwd_context.verify(plain, hashed)def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:    to_encode = data.copy()    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))    to_encode.update({"exp": expire})    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")def decode_token(token: str) -> dict | None:    try:        return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])    except JWTError:        return None
```
```
# src/auth/dependencies.pyfrom fastapi import Depends, HTTPException, statusfrom fastapi.security import OAuth2PasswordBearerfrom sqlalchemy.ext.asyncio import AsyncSessionfrom sqlalchemy import selectfrom src.database import get_dbfrom src.auth import service, models, schemasoauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")async def get_current_user(    token: str = Depends(oauth2_scheme),    db: AsyncSession = Depends(get_db)) -> models.User:    credentials_exception = HTTPException(        status_code=status.HTTP_401_UNAUTHORIZED,        detail="Could not validate credentials",        headers={"WWW-Authenticate": "Bearer"},    )    payload = service.decode_token(token)    if payload is None:        raise credentials_exception    user_id = payload.get("sub")    if user_id is None:        raise credentials_exception    result = await db.execute(        select(models.User).where(models.User.id == int(user_id))    )    user = result.scalar_one_or_none()    if user is None:        raise credentials_exception    return user
```
```
# src/auth/dependencies.pyfrom fastapi import Depends, HTTPException, statusfrom fastapi.security import OAuth2PasswordBearerfrom sqlalchemy.ext.asyncio import AsyncSessionfrom sqlalchemy import selectfrom src.database import get_dbfrom src.auth import service, models, schemasoauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")async def get_current_user(    token: str = Depends(oauth2_scheme),    db: AsyncSession = Depends(get_db)) -> models.User:    credentials_exception = HTTPException(        status_code=status.HTTP_401_UNAUTHORIZED,        detail="Could not validate credentials",        headers={"WWW-Authenticate": "Bearer"},    )    payload = service.decode_token(token)    if payload is None:        raise credentials_exception    user_id = payload.get("sub")    if user_id is None:        raise credentials_exception    result = await db.execute(        select(models.User).where(models.User.id == int(user_id))    )    user = result.scalar_one_or_none()    if user is None:        raise credentials_exception    return user
```
```
# src/auth/router.pyfrom fastapi import APIRouter, Depends, HTTPException, statusfrom fastapi.security import OAuth2PasswordRequestFormfrom sqlalchemy.ext.asyncio import AsyncSessionfrom sqlalchemy import selectfrom src.database import get_dbfrom src.auth import schemas, models, servicefrom src.auth.dependencies import get_current_userrouter = APIRouter(prefix="/auth", tags=["auth"])@router.post("/register", response_model=schemas.UserResponse)async def register(    user_in: schemas.UserCreate,    db: AsyncSession = Depends(get_db)):    # Check existing    result = await db.execute(        select(models.User).where(models.User.email == user_in.email)    )    if result.scalar_one_or_none():        raise HTTPException(status_code=400, detail="Email already registered")    user = models.User(        email=user_in.email,        hashed_password=service.hash_password(user_in.password)    )    db.add(user)    await db.commit()    await db.refresh(user)    return user@router.post("/login", response_model=schemas.Token)async def login(    form_data: OAuth2PasswordRequestForm = Depends(),    db: AsyncSession = Depends(get_db)):    result = await db.execute(        select(models.User).where(models.User.email == form_data.username)    )    user = result.scalar_one_or_none()    if not user or not service.verify_password(form_data.password, user.hashed_password):        raise HTTPException(            status_code=status.HTTP_401_UNAUTHORIZED,            detail="Incorrect email or password"        )    access_token = service.create_access_token(data={"sub": str(user.id)})    return schemas.Token(access_token=access_token)@router.get("/me", response_model=schemas.UserResponse)async def get_me(current_user: models.User = Depends(get_current_user)):    return current_user
```
```
# src/auth/router.pyfrom fastapi import APIRouter, Depends, HTTPException, statusfrom fastapi.security import OAuth2PasswordRequestFormfrom sqlalchemy.ext.asyncio import AsyncSessionfrom sqlalchemy import selectfrom src.database import get_dbfrom src.auth import schemas, models, servicefrom src.auth.dependencies import get_current_userrouter = APIRouter(prefix="/auth", tags=["auth"])@router.post("/register", response_model=schemas.UserResponse)async def register(    user_in: schemas.UserCreate,    db: AsyncSession = Depends(get_db)):    # Check existing    result = await db.execute(        select(models.User).where(models.User.email == user_in.email)    )    if result.scalar_one_or_none():        raise HTTPException(status_code=400, detail="Email already registered")    user = models.User(        email=user_in.email,        hashed_password=service.hash_password(user_in.password)    )    db.add(user)    await db.commit()    await db.refresh(user)    return user@router.post("/login", response_model=schemas.Token)async def login(    form_data: OAuth2PasswordRequestForm = Depends(),    db: AsyncSession = Depends(get_db)):    result = await db.execute(        select(models.User).where(models.User.email == form_data.username)    )    user = result.scalar_one_or_none()    if not user or not service.verify_password(form_data.password, user.hashed_password):        raise HTTPException(            status_code=status.HTTP_401_UNAUTHORIZED,            detail="Incorrect email or password"        )    access_token = service.create_access_token(data={"sub": str(user.id)})    return schemas.Token(access_token=access_token)@router.get("/me", response_model=schemas.UserResponse)async def get_me(current_user: models.User = Depends(get_current_user)):    return current_user
```
```
# In any routerfrom src.auth.dependencies import get_current_userfrom src.auth.models import User@router.post("/items")async def create_item(    item_in: schemas.ItemCreate,    current_user: User = Depends(get_current_user),  # Requires auth    db: AsyncSession = Depends(get_db)):    item = models.Item(**item_in.model_dump(), user_id=current_user.id)    # ...
```
```
# In any routerfrom src.auth.dependencies import get_current_userfrom src.auth.models import User@router.post("/items")async def create_item(    item_in: schemas.ItemCreate,    current_user: User = Depends(get_current_user),  # Requires auth    db: AsyncSession = Depends(get_db)):    item = models.Item(**item_in.model_dump(), user_id=current_user.id)    # ...
```
```
# src/config.pyfrom pydantic_settings import BaseSettingsclass Settings(BaseSettings):    DATABASE_URL: str = "sqlite+aiosqlite:///./database.db"    SECRET_KEY: str = "your-secret-key-change-in-production"    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30    class Config:        env_file = ".env"settings = Settings()
```
```
# src/config.pyfrom pydantic_settings import BaseSettingsclass Settings(BaseSettings):    DATABASE_URL: str = "sqlite+aiosqlite:///./database.db"    SECRET_KEY: str = "your-secret-key-change-in-production"    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30    class Config:        env_file = ".env"settings = Settings()
```
```
.env
```
```
DATABASE_URL=sqlite+aiosqlite:///./database.dbSECRET_KEY=your-super-secret-key-hereACCESS_TOKEN_EXPIRE_MINUTES=30
```
```
DATABASE_URL=sqlite+aiosqlite:///./database.dbSECRET_KEY=your-super-secret-key-hereACCESS_TOKEN_EXPIRE_MINUTES=30
```
```
Depends()
```
```
time.sleep()
```
```
asyncio.sleep()
```
```
*
```
```
model.model_fields_set
```
```
Form()
```
```
# ✗ AVOID: Pydantic model with Form when you need field_set metadatafrom typing import Annotatedfrom fastapi import Form@app.post("/form")async def endpoint(model: Annotated[MyModel, Form()]):    fields = model.model_fields_set  # Unreliable! ❌# ✓ USE: Individual form fields or JSON body instead@app.post("/form-individual")async def endpoint(    field_1: Annotated[bool, Form()] = True,    field_2: Annotated[str | None, Form()] = None):    # You know exactly what was provided ✓# ✓ OR: Use JSON body when metadata matters@app.post("/json")async def endpoint(model: MyModel):    fields = model.model_fields_set  # Works correctly ✓
```
```
# ✗ AVOID: Pydantic model with Form when you need field_set metadatafrom typing import Annotatedfrom fastapi import Form@app.post("/form")async def endpoint(model: Annotated[MyModel, Form()]):    fields = model.model_fields_set  # Unreliable! ❌# ✓ USE: Individual form fields or JSON body instead@app.post("/form-individual")async def endpoint(    field_1: Annotated[bool, Form()] = True,    field_2: Annotated[str | None, Form()] = None):    # You know exactly what was provided ✓# ✓ OR: Use JSON body when metadata matters@app.post("/json")async def endpoint(model: MyModel):    fields = model.model_fields_set  # Works correctly ✓
```
```
BackgroundTasks
```
```
Response
```
```
background
```
```
BackgroundTasks
```
```
# ✗ WRONG: Mixing both mechanismsfrom fastapi import BackgroundTasksfrom starlette.responses import Response, BackgroundTask@app.get("/")async def endpoint(tasks: BackgroundTasks):    tasks.add_task(send_email)  # This will be lost! ❌    return Response(        content="Done",        background=BackgroundTask(log_event)  # Only this runs    )# ✓ RIGHT: Use only BackgroundTasks dependency@app.get("/")async def endpoint(tasks: BackgroundTasks):    tasks.add_task(send_email)    tasks.add_task(log_event)    return {"status": "done"}  # All tasks run ✓# ✓ OR: Use only Response background (but can't inject dependencies)@app.get("/")async def endpoint():    return Response(        content="Done",        background=BackgroundTask(log_event)    )
```
```
# ✗ WRONG: Mixing both mechanismsfrom fastapi import BackgroundTasksfrom starlette.responses import Response, BackgroundTask@app.get("/")async def endpoint(tasks: BackgroundTasks):    tasks.add_task(send_email)  # This will be lost! ❌    return Response(        content="Done",        background=BackgroundTask(log_event)  # Only this runs    )# ✓ RIGHT: Use only BackgroundTasks dependency@app.get("/")async def endpoint(tasks: BackgroundTasks):    tasks.add_task(send_email)    tasks.add_task(log_event)    return {"status": "done"}  # All tasks run ✓# ✓ OR: Use only Response background (but can't inject dependencies)@app.get("/")async def endpoint():    return Response(        content="Done",        background=BackgroundTask(log_event)    )
```
```
BackgroundTasks
```
```
Response(background=...)
```
```
422: "Input should be 'abc' or 'def'"
```
```
Literal
```
```
None
```
```
from typing import Annotated, Literal, Optionalfrom fastapi import Formfrom fastapi.testclient import TestClient# ✗ PROBLEMATIC: Optional Literal with Form (breaks in 0.114.0+)@app.post("/")async def endpoint(    attribute: Annotated[Optional[Literal["abc", "def"]], Form()]):    return {"attribute": attribute}client = TestClient(app)data = {"attribute": None}  # or omit the fieldresponse = client.post("/", data=data)  # Returns 422 ❌# ✓ WORKAROUND 1: Don't pass None explicitly, omit the fielddata = {}  # Omit instead of Noneresponse = client.post("/", data=data)  # Works ✓# ✓ WORKAROUND 2: Avoid Literal types with optional form fields@app.post("/")async def endpoint(attribute: Annotated[str | None, Form()] = None):    # Validate in application logic instead    if attribute and attribute not in ["abc", "def"]:        raise HTTPException(400, "Invalid attribute")
```
```
from typing import Annotated, Literal, Optionalfrom fastapi import Formfrom fastapi.testclient import TestClient# ✗ PROBLEMATIC: Optional Literal with Form (breaks in 0.114.0+)@app.post("/")async def endpoint(    attribute: Annotated[Optional[Literal["abc", "def"]], Form()]):    return {"attribute": attribute}client = TestClient(app)data = {"attribute": None}  # or omit the fieldresponse = client.post("/", data=data)  # Returns 422 ❌# ✓ WORKAROUND 1: Don't pass None explicitly, omit the fielddata = {}  # Omit instead of Noneresponse = client.post("/", data=data)  # Works ✓# ✓ WORKAROUND 2: Avoid Literal types with optional form fields@app.post("/")async def endpoint(attribute: Annotated[str | None, Form()] = None):    # Validate in application logic instead    if attribute and attribute not in ["abc", "def"]:        raise HTTPException(400, "Invalid attribute")
```
```
"JSON object must be str, bytes or bytearray"
```
```
Json
```
```
Form()
```
```
str
```
```
from typing import Annotatedfrom fastapi import Formfrom pydantic import Json, BaseModel# ✗ WRONG: Json type directly with Form@app.post("/broken")async def broken(json_list: Annotated[Json[list[str]], Form()]) -> list[str]:    return json_list  # Returns 422 ❌# ✓ RIGHT: Accept as str, parse with Pydanticclass JsonListModel(BaseModel):    json_list: Json[list[str]]@app.post("/working")async def working(json_list: Annotated[str, Form()]) -> list[str]:    model = JsonListModel(json_list=json_list)  # Pydantic parses here    return model.json_list  # Works ✓
```
```
from typing import Annotatedfrom fastapi import Formfrom pydantic import Json, BaseModel# ✗ WRONG: Json type directly with Form@app.post("/broken")async def broken(json_list: Annotated[Json[list[str]], Form()]) -> list[str]:    return json_list  # Returns 422 ❌# ✓ RIGHT: Accept as str, parse with Pydanticclass JsonListModel(BaseModel):    json_list: Json[list[str]]@app.post("/working")async def working(json_list: Annotated[str, Form()]) -> list[str]:    model = JsonListModel(json_list=json_list)  # Pydantic parses here    return model.json_list  # Works ✓
```
```
Annotated
```
```
Depends()
```
```
__future__ import annotations
```
```
# ✗ PROBLEMATIC: Forward reference with Dependsfrom __future__ import annotationsfrom dataclasses import dataclassfrom typing import Annotatedfrom fastapi import Depends, FastAPIapp = FastAPI()def get_potato() -> Potato:  # Forward reference    return Potato(color='red', size=10)@app.get('/')async def read_root(potato: Annotated[Potato, Depends(get_potato)]):    return {'Hello': 'World'}# OpenAPI schema doesn't include Potato definition correctly ❌@dataclassclass Potato:    color: str    size: int# ✓ WORKAROUND 1: Don't use __future__ annotations in route files# Remove: from __future__ import annotations# ✓ WORKAROUND 2: Use string literals for type hintsdef get_potato() -> "Potato":    return Potato(color='red', size=10)# ✓ WORKAROUND 3: Define classes before they're used in dependencies@dataclassclass Potato:    color: str    size: intdef get_potato() -> Potato:  # Now works ✓    return Potato(color='red', size=10)
```
```
# ✗ PROBLEMATIC: Forward reference with Dependsfrom __future__ import annotationsfrom dataclasses import dataclassfrom typing import Annotatedfrom fastapi import Depends, FastAPIapp = FastAPI()def get_potato() -> Potato:  # Forward reference    return Potato(color='red', size=10)@app.get('/')async def read_root(potato: Annotated[Potato, Depends(get_potato)]):    return {'Hello': 'World'}# OpenAPI schema doesn't include Potato definition correctly ❌@dataclassclass Potato:    color: str    size: int# ✓ WORKAROUND 1: Don't use __future__ annotations in route files# Remove: from __future__ import annotations# ✓ WORKAROUND 2: Use string literals for type hintsdef get_potato() -> "Potato":    return Potato(color='red', size=10)# ✓ WORKAROUND 3: Define classes before they're used in dependencies@dataclassclass Potato:    color: str    size: intdef get_potato() -> Potato:  # Now works ✓    return Potato(color='red', size=10)
```
```
int | str
```
```
str
```
```
str
```
```
str
```
```
from uuid import UUID# ✗ PROBLEMATIC: Union with str in path parameter@app.get("/int/{path}")async def int_path(path: int | str):    return str(type(path))    # Pydantic v1: returns <class 'int'> for "123"    # Pydantic v2: returns <class 'str'> for "123" ❌@app.get("/uuid/{path}")async def uuid_path(path: UUID | str):    return str(type(path))    # Pydantic v1: returns <class 'uuid.UUID'> for valid UUID    # Pydantic v2: returns <class 'str'> ❌# ✓ RIGHT: Avoid union types with str in path/query parameters@app.get("/int/{path}")async def int_path(path: int):    return str(type(path))  # Works correctly ✓# ✓ ALTERNATIVE: Use validators if type coercion neededfrom pydantic import field_validatorclass PathParams(BaseModel):    path: int | str    @field_validator('path')    def coerce_to_int(cls, v):        if isinstance(v, str) and v.isdigit():            return int(v)        return v
```
```
from uuid import UUID# ✗ PROBLEMATIC: Union with str in path parameter@app.get("/int/{path}")async def int_path(path: int | str):    return str(type(path))    # Pydantic v1: returns <class 'int'> for "123"    # Pydantic v2: returns <class 'str'> for "123" ❌@app.get("/uuid/{path}")async def uuid_path(path: UUID | str):    return str(type(path))    # Pydantic v1: returns <class 'uuid.UUID'> for valid UUID    # Pydantic v2: returns <class 'str'> ❌# ✓ RIGHT: Avoid union types with str in path/query parameters@app.get("/int/{path}")async def int_path(path: int):    return str(type(path))  # Works correctly ✓# ✓ ALTERNATIVE: Use validators if type coercion neededfrom pydantic import field_validatorclass PathParams(BaseModel):    path: int | str    @field_validator('path')    def coerce_to_int(cls, v):        if isinstance(v, str) and v.isdigit():            return int(v)        return v
```
```
500 Internal Server Error
```
```
ValueError
```
```
ValueError
```
```
@field_validator
```
```
from typing import Annotatedfrom fastapi import Formfrom pydantic import BaseModel, field_validator, ValidationError, Field# ✗ WRONG: ValueError in validatorclass MyForm(BaseModel):    value: int    @field_validator('value')    def validate_value(cls, v):        if v < 0:            raise ValueError("Value must be positive")  # Returns 500! ❌        return v# ✓ RIGHT 1: Raise ValidationError insteadclass MyForm(BaseModel):    value: int    @field_validator('value')    def validate_value(cls, v):        if v < 0:            raise ValidationError("Value must be positive")  # Returns 422 ✓        return v# ✓ RIGHT 2: Use Pydantic's built-in constraintsclass MyForm(BaseModel):    value: Annotated[int, Field(gt=0)]  # Built-in validation, returns 422 ✓
```
```
from typing import Annotatedfrom fastapi import Formfrom pydantic import BaseModel, field_validator, ValidationError, Field# ✗ WRONG: ValueError in validatorclass MyForm(BaseModel):    value: int    @field_validator('value')    def validate_value(cls, v):        if v < 0:            raise ValueError("Value must be positive")  # Returns 500! ❌        return v# ✓ RIGHT 1: Raise ValidationError insteadclass MyForm(BaseModel):    value: int    @field_validator('value')    def validate_value(cls, v):        if v < 0:            raise ValidationError("Value must be positive")  # Returns 422 ✓        return v# ✓ RIGHT 2: Use Pydantic's built-in constraintsclass MyForm(BaseModel):    value: Annotated[int, Field(gt=0)]  # Built-in validation, returns 422 ✓
```
```
/docs
```
```
from fastapi.exceptions import RequestValidationErrorfrom fastapi.responses import JSONResponse@app.exception_handler(RequestValidationError)async def validation_exception_handler(request, exc):    return JSONResponse(        status_code=422,        content={"detail": exc.errors(), "body": exc.body}    )
```
```
from fastapi.exceptions import RequestValidationErrorfrom fastapi.responses import JSONResponse@app.exception_handler(RequestValidationError)async def validation_exception_handler(request, exc):    return JSONResponse(        status_code=422,        content={"detail": exc.errors(), "body": exc.body}    )
```
```
app.add_middleware(    CORSMiddleware,    allow_origins=["http://localhost:3000"],  # Not "*" in production    allow_credentials=True,    allow_methods=["*"],    allow_headers=["*"],)
```
```
app.add_middleware(    CORSMiddleware,    allow_origins=["http://localhost:3000"],  # Not "*" in production    allow_credentials=True,    allow_methods=["*"],    allow_headers=["*"],)
```
```
time.sleep()
```
```
# ✗ WRONG: Blocks event loopimport timefrom sqlalchemy import create_engine  # Sync client@app.get("/users")async def get_users():    time.sleep(0.1)  # Even small blocking adds up at scale!    result = sync_db_client.query("SELECT * FROM users")  # Blocks!    return result# ✓ RIGHT 1: Use async database driverfrom sqlalchemy.ext.asyncio import AsyncSessionfrom sqlalchemy import select@app.get("/users")async def get_users(db: AsyncSession = Depends(get_db)):    await asyncio.sleep(0.1)  # Non-blocking    result = await db.execute(select(User))    return result.scalars().all()# ✓ RIGHT 2: Use def (not async def) for CPU-bound routes# FastAPI runs def routes in thread pool automatically@app.get("/cpu-heavy")def cpu_heavy_task():  # Note: def not async def    return expensive_cpu_work()  # Runs in thread pool ✓# ✓ RIGHT 3: Use run_in_executor for blocking calls in async routesimport asynciofrom concurrent.futures import ThreadPoolExecutorexecutor = ThreadPoolExecutor()@app.get("/mixed")async def mixed_task():    # Run blocking function in thread pool    result = await asyncio.get_event_loop().run_in_executor(        executor,        blocking_function  # Your blocking function    )    return result
```
```
# ✗ WRONG: Blocks event loopimport timefrom sqlalchemy import create_engine  # Sync client@app.get("/users")async def get_users():    time.sleep(0.1)  # Even small blocking adds up at scale!    result = sync_db_client.query("SELECT * FROM users")  # Blocks!    return result# ✓ RIGHT 1: Use async database driverfrom sqlalchemy.ext.asyncio import AsyncSessionfrom sqlalchemy import select@app.get("/users")async def get_users(db: AsyncSession = Depends(get_db)):    await asyncio.sleep(0.1)  # Non-blocking    result = await db.execute(select(User))    return result.scalars().all()# ✓ RIGHT 2: Use def (not async def) for CPU-bound routes# FastAPI runs def routes in thread pool automatically@app.get("/cpu-heavy")def cpu_heavy_task():  # Note: def not async def    return expensive_cpu_work()  # Runs in thread pool ✓# ✓ RIGHT 3: Use run_in_executor for blocking calls in async routesimport asynciofrom concurrent.futures import ThreadPoolExecutorexecutor = ThreadPoolExecutor()@app.get("/mixed")async def mixed_task():    # Run blocking function in thread pool    result = await asyncio.get_event_loop().run_in_executor(        executor,        blocking_function  # Your blocking function    )    return result
```
```
Optional[str]
```
```
# Wrongdescription: Optional[str]  # Still required!# Rightdescription: str | None = None  # Optional with default
```
```
# Wrongdescription: Optional[str]  # Still required!# Rightdescription: str | None = None  # Optional with default
```
```
# tests/test_main.pyimport pytestfrom httpx import AsyncClient, ASGITransportfrom src.main import app@pytest.fixtureasync def client():    async with AsyncClient(        transport=ASGITransport(app=app),        base_url="http://test"    ) as ac:        yield ac@pytest.mark.asyncioasync def test_root(client):    response = await client.get("/")    assert response.status_code == 200@pytest.mark.asyncioasync def test_create_item(client):    response = await client.post(        "/items",        json={"name": "Test", "price": 9.99}    )    assert response.status_code == 201    assert response.json()["name"] == "Test"
```
```
# tests/test_main.pyimport pytestfrom httpx import AsyncClient, ASGITransportfrom src.main import app@pytest.fixtureasync def client():    async with AsyncClient(        transport=ASGITransport(app=app),        base_url="http://test"    ) as ac:        yield ac@pytest.mark.asyncioasync def test_root(client):    response = await client.get("/")    assert response.status_code == 200@pytest.mark.asyncioasync def test_create_item(client):    response = await client.post(        "/items",        json={"name": "Test", "price": 9.99}    )    assert response.status_code == 201    assert response.json()["name"] == "Test"
```
```
uv run pytest
```
```
uv run fastapi dev src/main.py
```
```
uv run fastapi dev src/main.py
```
```
uv run uvicorn src.main:app --host 0.0.0.0 --port 8000
```
```
uv run uvicorn src.main:app --host 0.0.0.0 --port 8000
```
```
uv add gunicornuv run gunicorn src.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```
```
uv add gunicornuv run gunicorn src.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```
```
FROM python:3.12-slimWORKDIR /appCOPY . .RUN pip install uv && uv syncEXPOSE 8000CMD ["uv", "run", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```
```
FROM python:3.12-slimWORKDIR /appCOPY . .RUN pip install uv && uv syncEXPOSE 8000CMD ["uv", "run", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```
Unlock the full potential of your AI coding assistant with this specialized FastAPI Agent Skill. Designed for modern Python web development, it provides comprehensive, production-ready patterns for building robust APIs. Leveraging cutting-edge versions of FastAPI, Pydantic v2, and SQLAlchemy 2.0 async, this skill empowers you to implement secure, high-performance backends with ease. From setting up JWT authentication to structuring scalable projects, it ensures your generated code adheres to industry best practices, accelerating your development workflow and maintaining code quality. Seamlessly integrate advanced API features and focus on business logic rather than boilerplate.

# When to Use This Skill
- •Rapidly developing new RESTful APIs with secure authentication.
- •Migrating existing Python backends to a modern, async framework like FastAPI.
- •Implementing database interactions using SQLAlchemy 2.0 async with Pydantic models.
- •Structuring complex FastAPI projects with a domain-based approach for scalability.

# Pro Tips
- 💡Always specify exact dependency versions in your `uv` or `pip` setup to ensure consistent deployments across environments.
- 💡Leverage the domain-based project structure provided to maintain scalability and testability as your FastAPI application grows.
- 💡Utilize FastAPI's automatic OpenAPI documentation (`/docs` endpoint) to quickly share and test API endpoints during development.


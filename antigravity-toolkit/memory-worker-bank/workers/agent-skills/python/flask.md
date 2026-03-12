# flask
Source: https://antigravity.codes/agent-skills/python/flask

## AI Worker Instructions
When the user requests functionality related to flask, follow these guidelines and utilize this context.

## Scraped Content

# flask
```
# Create projectuv init my-flask-appcd my-flask-app# Add dependenciesuv add flask flask-sqlalchemy flask-login flask-wtf python-dotenv# Run development serveruv run flask --app app run --debug
```
```
# Create projectuv init my-flask-appcd my-flask-app# Add dependenciesuv add flask flask-sqlalchemy flask-login flask-wtf python-dotenv# Run development serveruv run flask --app app run --debug
```
```
# app.pyfrom flask import Flaskapp = Flask(__name__)@app.route("/")def hello():    return {"message": "Hello, World!"}if __name__ == "__main__":    app.run(debug=True)
```
```
# app.pyfrom flask import Flaskapp = Flask(__name__)@app.route("/")def hello():    return {"message": "Hello, World!"}if __name__ == "__main__":    app.run(debug=True)
```
```
uv run flask --app app run --debug
```
```
KeyError
```
```
stream_with_context
```
```
stream_with_context
```
```
teardown_request()
```
```
g.pop(key)
```
```
# WRONG - fails on second teardown call@app.teardown_requestdef _teardown_request(_):    g.pop("hello")  # KeyError on second call# RIGHT - idempotent teardown@app.teardown_requestdef _teardown_request(_):    g.pop("hello", None)  # Provide default value
```
```
# WRONG - fails on second teardown call@app.teardown_requestdef _teardown_request(_):    g.pop("hello")  # KeyError on second call# RIGHT - idempotent teardown@app.teardown_requestdef _teardown_request(_):    g.pop("hello", None)  # Provide default value
```
```
RuntimeError
```
```
threading.Thread
```
```
import asyncioimport gevent.monkeyimport gevent.selectorsfrom flask import Flaskgevent.monkey.patch_all()loop = asyncio.EventLoop(gevent.selectors.DefaultSelector())gevent.spawn(loop.run_forever)class GeventFlask(Flask):    def async_to_sync(self, func):        def run(*args, **kwargs):            coro = func(*args, **kwargs)            future = asyncio.run_coroutine_threadsafe(coro, loop)            return future.result()        return runapp = GeventFlask(__name__)
```
```
import asyncioimport gevent.monkeyimport gevent.selectorsfrom flask import Flaskgevent.monkey.patch_all()loop = asyncio.EventLoop(gevent.selectors.DefaultSelector())gevent.spawn(loop.run_forever)class GeventFlask(Flask):    def async_to_sync(self, func):        def run(*args, **kwargs):            coro = func(*args, **kwargs)            future = asyncio.run_coroutine_threadsafe(coro, loop)            return future.result()        return runapp = GeventFlask(__name__)
```
```
follow_redirects=True
```
```
# If using Flask >= 3.1.2, follow_redirects works correctlydef test_login_redirect(client):    response = client.post('/login',        data={'email': 'test@example.com', 'password': 'pass'},        follow_redirects=True)    assert 'user_id' in session  # Works in 3.1.2+# For Flask < 3.1.2, make separate requestsresponse = client.post('/login', data={...})assert response.status_code == 302response = client.get(response.location)  # Explicit redirect follow
```
```
# If using Flask >= 3.1.2, follow_redirects works correctlydef test_login_redirect(client):    response = client.post('/login',        data={'email': 'test@example.com', 'password': 'pass'},        follow_redirects=True)    assert 'user_id' in session  # Works in 3.1.2+# For Flask < 3.1.2, make separate requestsresponse = client.post('/login', data={...})assert response.status_code == 302response = client.get(response.location)  # Explicit redirect follow
```
```
RuntimeError: Working outside of application context
```
```
current_app
```
```
_get_current_object()
```
```
from flask import current_appimport threading# WRONG - current_app is a proxy, loses context in threaddef background_task():    app_name = current_app.name  # Fails!@app.route('/start')def start_task():    thread = threading.Thread(target=background_task)    thread.start()# RIGHT - unwrap proxy and push contextdef background_task(app):    with app.app_context():        app_name = app.name  # Works!@app.route('/start')def start_task():    app = current_app._get_current_object()    thread = threading.Thread(target=background_task, args=(app,))    thread.start()
```
```
from flask import current_appimport threading# WRONG - current_app is a proxy, loses context in threaddef background_task():    app_name = current_app.name  # Fails!@app.route('/start')def start_task():    thread = threading.Thread(target=background_task)    thread.start()# RIGHT - unwrap proxy and push contextdef background_task(app):    with app.app_context():        app_name = app.name  # Works!@app.route('/start')def start_task():    app = current_app._get_current_object()    thread = threading.Thread(target=background_task, args=(app,))    thread.start()
```
```
# app/extensions.pyfrom flask_login import LoginManagerlogin_manager = LoginManager()login_manager.session_protection = "basic"  # Default, less strict# login_manager.session_protection = "strong"  # Strict, may logout on IP change# login_manager.session_protection = None  # Disabled (not recommended)
```
```
# app/extensions.pyfrom flask_login import LoginManagerlogin_manager = LoginManager()login_manager.session_protection = "basic"  # Default, less strict# login_manager.session_protection = "strong"  # Strict, may logout on IP change# login_manager.session_protection = None  # Disabled (not recommended)
```
```
WTF_CSRF_TIME_LIMIT
```
```
# Option 1: Align cache duration with token lifetimeWTF_CSRF_TIME_LIMIT = None  # Never expire (less secure)# Option 2: Exclude forms from cache@app.after_requestdef add_cache_headers(response):    if request.method == 'GET' and 'form' in request.endpoint:        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'    return response# Option 3: Configure webserver to not cache POST targets# In Nginx: add "proxy_cache_bypass $cookie_session" for form routes
```
```
# Option 1: Align cache duration with token lifetimeWTF_CSRF_TIME_LIMIT = None  # Never expire (less secure)# Option 2: Exclude forms from cache@app.after_requestdef add_cache_headers(response):    if request.method == 'GET' and 'form' in request.endpoint:        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'    return response# Option 3: Configure webserver to not cache POST targets# In Nginx: add "proxy_cache_bypass $cookie_session" for form routes
```
```
Request.max_content_length
```
```
from flask import Flask, requestapp = Flask(__name__)app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB default@app.route('/upload', methods=['POST'])def upload():    # Override for this specific route    request.max_content_length = 100 * 1024 * 1024  # 100MB for uploads    file = request.files['file']    # ...
```
```
from flask import Flask, requestapp = Flask(__name__)app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB default@app.route('/upload', methods=['POST'])def upload():    # Override for this specific route    request.max_content_length = 100 * 1024 * 1024  # 100MB for uploads    file = request.files['file']    # ...
```
```
MAX_FORM_MEMORY_SIZE
```
```
MAX_FORM_PARTS
```
```
SECRET_KEY_FALLBACKS
```
```
# config.pyclass Config:    SECRET_KEY = "new-secret-key-2024"    SECRET_KEY_FALLBACKS = [        "old-secret-key-2023",        "older-secret-key-2022"    ]
```
```
# config.pyclass Config:    SECRET_KEY = "new-secret-key-2024"    SECRET_KEY_FALLBACKS = [        "old-secret-key-2023",        "older-secret-key-2022"    ]
```
```
flask==2.2.4 incompatible with werkzeug==3.1.3
```
```
# Update all Pallets projects togetherpip install flask>=3.1.0 werkzeug>=3.1.0 itsdangerous>=2.2.0 blinker>=1.9.0# Or with uvuv add "flask>=3.1.0" "werkzeug>=3.1.0" "itsdangerous>=2.2.0" "blinker>=1.9.0"
```
```
# Update all Pallets projects togetherpip install flask>=3.1.0 werkzeug>=3.1.0 itsdangerous>=2.2.0 blinker>=1.9.0# Or with uvuv add "flask>=3.1.0" "werkzeug>=3.1.0" "itsdangerous>=2.2.0" "blinker>=1.9.0"
```
```
my-flask-app/├── pyproject.toml├── config.py                # Configuration classes├── run.py                   # Entry point│├── app/│   ├── __init__.py          # Application factory (create_app)│   ├── extensions.py        # Flask extensions (db, login_manager)│   ├── models.py            # SQLAlchemy models│   ││   ├── main/                # Main blueprint│   │   ├── __init__.py│   │   └── routes.py│   ││   ├── auth/                # Auth blueprint│   │   ├── __init__.py│   │   ├── routes.py│   │   └── forms.py│   ││   ├── templates/│   │   ├── base.html│   │   ├── main/│   │   └── auth/│   ││   └── static/│       ├── css/│       └── js/│└── tests/    ├── conftest.py    └── test_main.py
```
```
my-flask-app/├── pyproject.toml├── config.py                # Configuration classes├── run.py                   # Entry point│├── app/│   ├── __init__.py          # Application factory (create_app)│   ├── extensions.py        # Flask extensions (db, login_manager)│   ├── models.py            # SQLAlchemy models│   ││   ├── main/                # Main blueprint│   │   ├── __init__.py│   │   └── routes.py│   ││   ├── auth/                # Auth blueprint│   │   ├── __init__.py│   │   ├── routes.py│   │   └── forms.py│   ││   ├── templates/│   │   ├── base.html│   │   ├── main/│   │   └── auth/│   ││   └── static/│       ├── css/│       └── js/│└── tests/    ├── conftest.py    └── test_main.py
```
```
# app/__init__.pyfrom flask import Flaskfrom app.extensions import db, login_managerfrom config import Configdef create_app(config_class=Config):    """Application factory function."""    app = Flask(__name__)    app.config.from_object(config_class)    # Initialize extensions    db.init_app(app)    login_manager.init_app(app)    # Register blueprints    from app.main import bp as main_bp    from app.auth import bp as auth_bp    app.register_blueprint(main_bp)    app.register_blueprint(auth_bp, url_prefix="/auth")    # Create database tables    with app.app_context():        db.create_all()    return app
```
```
# app/__init__.pyfrom flask import Flaskfrom app.extensions import db, login_managerfrom config import Configdef create_app(config_class=Config):    """Application factory function."""    app = Flask(__name__)    app.config.from_object(config_class)    # Initialize extensions    db.init_app(app)    login_manager.init_app(app)    # Register blueprints    from app.main import bp as main_bp    from app.auth import bp as auth_bp    app.register_blueprint(main_bp)    app.register_blueprint(auth_bp, url_prefix="/auth")    # Create database tables    with app.app_context():        db.create_all()    return app
```
```
# app/extensions.pyfrom flask_sqlalchemy import SQLAlchemyfrom flask_login import LoginManagerdb = SQLAlchemy()login_manager = LoginManager()login_manager.login_view = "auth.login"login_manager.login_message_category = "info"
```
```
# app/extensions.pyfrom flask_sqlalchemy import SQLAlchemyfrom flask_login import LoginManagerdb = SQLAlchemy()login_manager = LoginManager()login_manager.login_view = "auth.login"login_manager.login_message_category = "info"
```
```
db
```
```
app
```
```
# config.pyimport osfrom dotenv import load_dotenvload_dotenv()class Config:    """Base configuration."""    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key")    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///app.db")    SQLALCHEMY_TRACK_MODIFICATIONS = Falseclass DevelopmentConfig(Config):    """Development configuration."""    DEBUG = Trueclass TestingConfig(Config):    """Testing configuration."""    TESTING = True    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"    WTF_CSRF_ENABLED = Falseclass ProductionConfig(Config):    """Production configuration."""    DEBUG = False
```
```
# config.pyimport osfrom dotenv import load_dotenvload_dotenv()class Config:    """Base configuration."""    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key")    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///app.db")    SQLALCHEMY_TRACK_MODIFICATIONS = Falseclass DevelopmentConfig(Config):    """Development configuration."""    DEBUG = Trueclass TestingConfig(Config):    """Testing configuration."""    TESTING = True    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"    WTF_CSRF_ENABLED = Falseclass ProductionConfig(Config):    """Production configuration."""    DEBUG = False
```
```
# run.pyfrom app import create_appapp = create_app()if __name__ == "__main__":    app.run()
```
```
# run.pyfrom app import create_appapp = create_app()if __name__ == "__main__":    app.run()
```
```
flask --app run run --debug
```
```
# app/main/__init__.pyfrom flask import Blueprintbp = Blueprint("main", __name__)from app.main import routes  # Import routes after bp is created!
```
```
# app/main/__init__.pyfrom flask import Blueprintbp = Blueprint("main", __name__)from app.main import routes  # Import routes after bp is created!
```
```
# app/main/routes.pyfrom flask import render_template, jsonifyfrom app.main import bp@bp.route("/")def index():    return render_template("main/index.html")@bp.route("/api/health")def health():    return jsonify({"status": "ok"})
```
```
# app/main/routes.pyfrom flask import render_template, jsonifyfrom app.main import bp@bp.route("/")def index():    return render_template("main/index.html")@bp.route("/api/health")def health():    return jsonify({"status": "ok"})
```
```
# app/auth/__init__.pyfrom flask import Blueprintbp = Blueprint(    "auth",    __name__,    template_folder="templates",  # Blueprint-specific templates    static_folder="static",       # Blueprint-specific static files)from app.auth import routes
```
```
# app/auth/__init__.pyfrom flask import Blueprintbp = Blueprint(    "auth",    __name__,    template_folder="templates",  # Blueprint-specific templates    static_folder="static",       # Blueprint-specific static files)from app.auth import routes
```
```
# app/models.pyfrom datetime import datetimefrom flask_login import UserMixinfrom werkzeug.security import generate_password_hash, check_password_hashfrom app.extensions import db, login_managerclass User(UserMixin, db.Model):    """User model for authentication."""    __tablename__ = "users"    id = db.Column(db.Integer, primary_key=True)    email = db.Column(db.String(120), unique=True, nullable=False, index=True)    password_hash = db.Column(db.String(256), nullable=False)    is_active = db.Column(db.Boolean, default=True)    created_at = db.Column(db.DateTime, default=datetime.utcnow)    def set_password(self, password):        self.password_hash = generate_password_hash(password)    def check_password(self, password):        return check_password_hash(self.password_hash, password)    def __repr__(self):        return f"<User {self.email}>"@login_manager.user_loaderdef load_user(user_id):    return User.query.get(int(user_id))
```
```
# app/models.pyfrom datetime import datetimefrom flask_login import UserMixinfrom werkzeug.security import generate_password_hash, check_password_hashfrom app.extensions import db, login_managerclass User(UserMixin, db.Model):    """User model for authentication."""    __tablename__ = "users"    id = db.Column(db.Integer, primary_key=True)    email = db.Column(db.String(120), unique=True, nullable=False, index=True)    password_hash = db.Column(db.String(256), nullable=False)    is_active = db.Column(db.Boolean, default=True)    created_at = db.Column(db.DateTime, default=datetime.utcnow)    def set_password(self, password):        self.password_hash = generate_password_hash(password)    def check_password(self, password):        return check_password_hash(self.password_hash, password)    def __repr__(self):        return f"<User {self.email}>"@login_manager.user_loaderdef load_user(user_id):    return User.query.get(int(user_id))
```
```
# app/auth/forms.pyfrom flask_wtf import FlaskFormfrom wtforms import StringField, PasswordField, BooleanField, SubmitFieldfrom wtforms.validators import DataRequired, Email, Length, EqualTo, ValidationErrorfrom app.models import Userclass LoginForm(FlaskForm):    email = StringField("Email", validators=[DataRequired(), Email()])    password = PasswordField("Password", validators=[DataRequired()])    remember = BooleanField("Remember Me")    submit = SubmitField("Login")class RegistrationForm(FlaskForm):    email = StringField("Email", validators=[DataRequired(), Email()])    password = PasswordField("Password", validators=[DataRequired(), Length(min=8)])    confirm = PasswordField("Confirm Password", validators=[        DataRequired(), EqualTo("password", message="Passwords must match")    ])    submit = SubmitField("Register")    def validate_email(self, field):        if User.query.filter_by(email=field.data).first():            raise ValidationError("Email already registered.")
```
```
# app/auth/forms.pyfrom flask_wtf import FlaskFormfrom wtforms import StringField, PasswordField, BooleanField, SubmitFieldfrom wtforms.validators import DataRequired, Email, Length, EqualTo, ValidationErrorfrom app.models import Userclass LoginForm(FlaskForm):    email = StringField("Email", validators=[DataRequired(), Email()])    password = PasswordField("Password", validators=[DataRequired()])    remember = BooleanField("Remember Me")    submit = SubmitField("Login")class RegistrationForm(FlaskForm):    email = StringField("Email", validators=[DataRequired(), Email()])    password = PasswordField("Password", validators=[DataRequired(), Length(min=8)])    confirm = PasswordField("Confirm Password", validators=[        DataRequired(), EqualTo("password", message="Passwords must match")    ])    submit = SubmitField("Register")    def validate_email(self, field):        if User.query.filter_by(email=field.data).first():            raise ValidationError("Email already registered.")
```
```
# app/auth/routes.pyfrom flask import render_template, redirect, url_for, flash, requestfrom flask_login import login_user, logout_user, login_required, current_userfrom app.auth import bpfrom app.auth.forms import LoginForm, RegistrationFormfrom app.extensions import dbfrom app.models import User@bp.route("/register", methods=["GET", "POST"])def register():    if current_user.is_authenticated:        return redirect(url_for("main.index"))    form = RegistrationForm()    if form.validate_on_submit():        user = User(email=form.email.data)        user.set_password(form.password.data)        db.session.add(user)        db.session.commit()        flash("Registration successful! Please log in.", "success")        return redirect(url_for("auth.login"))    return render_template("auth/register.html", form=form)@bp.route("/login", methods=["GET", "POST"])def login():    if current_user.is_authenticated:        return redirect(url_for("main.index"))    form = LoginForm()    if form.validate_on_submit():        user = User.query.filter_by(email=form.email.data).first()        if user and user.check_password(form.password.data):            login_user(user, remember=form.remember.data)            next_page = request.args.get("next")            flash("Logged in successfully!", "success")            return redirect(next_page or url_for("main.index"))        flash("Invalid email or password.", "danger")    return render_template("auth/login.html", form=form)@bp.route("/logout")@login_requireddef logout():    logout_user()    flash("You have been logged out.", "info")    return redirect(url_for("main.index"))
```
```
# app/auth/routes.pyfrom flask import render_template, redirect, url_for, flash, requestfrom flask_login import login_user, logout_user, login_required, current_userfrom app.auth import bpfrom app.auth.forms import LoginForm, RegistrationFormfrom app.extensions import dbfrom app.models import User@bp.route("/register", methods=["GET", "POST"])def register():    if current_user.is_authenticated:        return redirect(url_for("main.index"))    form = RegistrationForm()    if form.validate_on_submit():        user = User(email=form.email.data)        user.set_password(form.password.data)        db.session.add(user)        db.session.commit()        flash("Registration successful! Please log in.", "success")        return redirect(url_for("auth.login"))    return render_template("auth/register.html", form=form)@bp.route("/login", methods=["GET", "POST"])def login():    if current_user.is_authenticated:        return redirect(url_for("main.index"))    form = LoginForm()    if form.validate_on_submit():        user = User.query.filter_by(email=form.email.data).first()        if user and user.check_password(form.password.data):            login_user(user, remember=form.remember.data)            next_page = request.args.get("next")            flash("Logged in successfully!", "success")            return redirect(next_page or url_for("main.index"))        flash("Invalid email or password.", "danger")    return render_template("auth/login.html", form=form)@bp.route("/logout")@login_requireddef logout():    logout_user()    flash("You have been logged out.", "info")    return redirect(url_for("main.index"))
```
```
from flask_login import login_required, current_user@bp.route("/dashboard")@login_requireddef dashboard():    return render_template("main/dashboard.html", user=current_user)
```
```
from flask_login import login_required, current_user@bp.route("/dashboard")@login_requireddef dashboard():    return render_template("main/dashboard.html", user=current_user)
```
```
# app/api/__init__.pyfrom flask import Blueprintbp = Blueprint("api", __name__)from app.api import routes
```
```
# app/api/__init__.pyfrom flask import Blueprintbp = Blueprint("api", __name__)from app.api import routes
```
```
# app/api/routes.pyfrom flask import jsonify, requestfrom flask_login import login_required, current_userfrom app.api import bpfrom app.extensions import dbfrom app.models import User@bp.route("/users", methods=["GET"])@login_requireddef get_users():    users = User.query.all()    return jsonify([        {"id": u.id, "email": u.email}        for u in users    ])@bp.route("/users", methods=["POST"])def create_user():    data = request.get_json()    if not data or "email" not in data or "password" not in data:        return jsonify({"error": "Missing required fields"}), 400    if User.query.filter_by(email=data["email"]).first():        return jsonify({"error": "Email already exists"}), 409    user = User(email=data["email"])    user.set_password(data["password"])    db.session.add(user)    db.session.commit()    return jsonify({"id": user.id, "email": user.email}), 201
```
```
# app/api/routes.pyfrom flask import jsonify, requestfrom flask_login import login_required, current_userfrom app.api import bpfrom app.extensions import dbfrom app.models import User@bp.route("/users", methods=["GET"])@login_requireddef get_users():    users = User.query.all()    return jsonify([        {"id": u.id, "email": u.email}        for u in users    ])@bp.route("/users", methods=["POST"])def create_user():    data = request.get_json()    if not data or "email" not in data or "password" not in data:        return jsonify({"error": "Missing required fields"}), 400    if User.query.filter_by(email=data["email"]).first():        return jsonify({"error": "Email already exists"}), 409    user = User(email=data["email"])    user.set_password(data["password"])    db.session.add(user)    db.session.commit()    return jsonify({"id": user.id, "email": user.email}), 201
```
```
app.register_blueprint(api_bp, url_prefix="/api/v1")
```
```
app.register_blueprint(api_bp, url_prefix="/api/v1")
```
```
__init__.py
```
```
bp
```
```
current_app
```
```
app
```
```
with app.app_context()
```
```
app
```
```
db
```
```
app.run()
```
```
ImportError: cannot import name 'X' from partially initialized module
```
```
# WRONG - circular import# app/__init__.pyfrom app.models import User  # models.py imports db from here!# RIGHT - deferred import# app/__init__.pydef create_app():    # ... setup ...    from app.models import User  # Import inside factory
```
```
# WRONG - circular import# app/__init__.pyfrom app.models import User  # models.py imports db from here!# RIGHT - deferred import# app/__init__.pydef create_app():    # ... setup ...    from app.models import User  # Import inside factory
```
```
RuntimeError: Working outside of application context
```
```
current_app
```
```
g
```
```
db
```
```
# WRONGfrom app import create_appapp = create_app()users = User.query.all()  # No context!# RIGHTfrom app import create_appapp = create_app()with app.app_context():    users = User.query.all()  # Has context
```
```
# WRONGfrom app import create_appapp = create_app()users = User.query.all()  # No context!# RIGHTfrom app import create_appapp = create_app()with app.app_context():    users = User.query.all()  # Has context
```
```
werkzeug.routing.BuildError: Could not build url for endpoint
```
```
url_for()
```
```
# WRONGurl_for("login")# RIGHT - include blueprint nameurl_for("auth.login")
```
```
# WRONGurl_for("login")# RIGHT - include blueprint nameurl_for("auth.login")
```
```
Bad Request: The CSRF token is missing
```
```
<form method="post">    {{ form.hidden_tag() }}  <!-- Adds CSRF token -->    <!-- form fields --></form>
```
```
<form method="post">    {{ form.hidden_tag() }}  <!-- Adds CSRF token -->    <!-- form fields --></form>
```
```
# tests/conftest.pyimport pytestfrom app import create_appfrom app.extensions import dbfrom config import TestingConfig@pytest.fixturedef app():    app = create_app(TestingConfig)    with app.app_context():        db.create_all()        yield app        db.drop_all()@pytest.fixturedef client(app):    return app.test_client()@pytest.fixturedef runner(app):    return app.test_cli_runner()
```
```
# tests/conftest.pyimport pytestfrom app import create_appfrom app.extensions import dbfrom config import TestingConfig@pytest.fixturedef app():    app = create_app(TestingConfig)    with app.app_context():        db.create_all()        yield app        db.drop_all()@pytest.fixturedef client(app):    return app.test_client()@pytest.fixturedef runner(app):    return app.test_cli_runner()
```
```
# tests/test_main.pydef test_index(client):    response = client.get("/")    assert response.status_code == 200def test_register(client):    response = client.post("/auth/register", data={        "email": "test@example.com",        "password": "testpass123",        "confirm": "testpass123",    }, follow_redirects=True)    assert response.status_code == 200
```
```
# tests/test_main.pydef test_index(client):    response = client.get("/")    assert response.status_code == 200def test_register(client):    response = client.post("/auth/register", data={        "email": "test@example.com",        "password": "testpass123",        "confirm": "testpass123",    }, follow_redirects=True)    assert response.status_code == 200
```
```
uv run pytest
```
```
flask --app run run --debug
```
```
flask --app run run --debug
```
```
uv add gunicornuv run gunicorn -w 4 -b 0.0.0.0:8000 "run:app"
```
```
uv add gunicornuv run gunicorn -w 4 -b 0.0.0.0:8000 "run:app"
```
```
FROM python:3.12-slimWORKDIR /appCOPY . .RUN pip install uv && uv syncEXPOSE 8000CMD ["uv", "run", "gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "run:app"]
```
```
FROM python:3.12-slimWORKDIR /appCOPY . .RUN pip install uv && uv syncEXPOSE 8000CMD ["uv", "run", "gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "run:app"]
```
```
SECRET_KEY=your-production-secret-keyDATABASE_URL=postgresql://user:pass@localhost/dbnameFLASK_ENV=production
```
```
SECRET_KEY=your-production-secret-keyDATABASE_URL=postgresql://user:pass@localhost/dbnameFLASK_ENV=production
```
This specialized Flask Agent Skill empowers developers to build and maintain high-quality Python web applications with confidence. It codifies production-tested patterns, guiding users through advanced topics like the application factory pattern, Blueprint organization, and efficient database interactions using Flask-SQLAlchemy. Designed to streamline development workflows for Claude Code and Cursor, this skill also proactively addresses common Flask issues, ensuring your projects are resilient, scalable, and follow modern best practices. Leverage its comprehensive examples and robust rule set to accelerate your Flask journey from concept to deployment.

# When to Use This Skill
- •Scaffolding a new Flask project with an application factory pattern and Blueprints for modularity.
- •Integrating Flask with Flask-SQLAlchemy for robust database operations and model management.
- •Troubleshooting and preventing common Flask framework issues, such as the stream_with_context Teardown Regression.
- •Developing secure authentication and authorization flows using Flask-Login and Flask-WTF within a Flask application.

# Pro Tips
- 💡Always start with the application factory pattern for better testability, configuration management, and scalability, even for smaller projects.
- 💡Utilize Flask Blueprints to modularize your application's routes and logic, separating concerns and improving maintainability as your project grows.
- 💡Pay close attention to dependency versions and use modern package managers like `uv` to ensure a consistent development environment and prevent known issues highlighted by the skill.


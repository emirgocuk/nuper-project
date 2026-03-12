# rust-async-patterns
Source: https://antigravity.codes/agent-skills/backend/rust-async-patterns

## AI Worker Instructions
When the user requests functionality related to rust-async-patterns, follow these guidelines and utilize this context.

## Scraped Content

# rust-async-patterns
```
Future (lazy) → poll() → Ready(value) | Pending                ↑           ↓              Waker ← Runtime schedules
```
```
Future (lazy) → poll() → Ready(value) | Pending                ↑           ↓              Waker ← Runtime schedules
```
```
Future
```
```
async fn
```
```
await
```
```
Task
```
```
Runtime
```
```
# Cargo.toml[dependencies]tokio = { version = "1", features = ["full"] }futures = "0.3"async-trait = "0.1"anyhow = "1.0"tracing = "0.1"tracing-subscriber = "0.3"
```
```
# Cargo.toml[dependencies]tokio = { version = "1", features = ["full"] }futures = "0.3"async-trait = "0.1"anyhow = "1.0"tracing = "0.1"tracing-subscriber = "0.3"
```
```
use tokio::time::{sleep, Duration};use anyhow::Result;#[tokio::main]async fn main() -> Result<()> {    // Initialize tracing    tracing_subscriber::fmt::init();    // Async operations    let result = fetch_data("https://api.example.com").await?;    println!("Got: {}", result);    Ok(())}async fn fetch_data(url: &str) -> Result<String> {    // Simulated async operation    sleep(Duration::from_millis(100)).await;    Ok(format!("Data from {}", url))}
```
```
use tokio::time::{sleep, Duration};use anyhow::Result;#[tokio::main]async fn main() -> Result<()> {    // Initialize tracing    tracing_subscriber::fmt::init();    // Async operations    let result = fetch_data("https://api.example.com").await?;    println!("Got: {}", result);    Ok(())}async fn fetch_data(url: &str) -> Result<String> {    // Simulated async operation    sleep(Duration::from_millis(100)).await;    Ok(format!("Data from {}", url))}
```
```
use tokio::task::JoinSet;use anyhow::Result;// Spawn multiple concurrent tasksasync fn fetch_all_concurrent(urls: Vec<String>) -> Result<Vec<String>> {    let mut set = JoinSet::new();    for url in urls {        set.spawn(async move {            fetch_data(&url).await        });    }    let mut results = Vec::new();    while let Some(res) = set.join_next().await {        match res {            Ok(Ok(data)) => results.push(data),            Ok(Err(e)) => tracing::error!("Task failed: {}", e),            Err(e) => tracing::error!("Join error: {}", e),        }    }    Ok(results)}// With concurrency limituse futures::stream::{self, StreamExt};async fn fetch_with_limit(urls: Vec<String>, limit: usize) -> Vec<Result<String>> {    stream::iter(urls)        .map(|url| async move { fetch_data(&url).await })        .buffer_unordered(limit) // Max concurrent tasks        .collect()        .await}// Select first to completeuse tokio::select;async fn race_requests(url1: &str, url2: &str) -> Result<String> {    select! {        result = fetch_data(url1) => result,        result = fetch_data(url2) => result,    }}
```
```
use tokio::task::JoinSet;use anyhow::Result;// Spawn multiple concurrent tasksasync fn fetch_all_concurrent(urls: Vec<String>) -> Result<Vec<String>> {    let mut set = JoinSet::new();    for url in urls {        set.spawn(async move {            fetch_data(&url).await        });    }    let mut results = Vec::new();    while let Some(res) = set.join_next().await {        match res {            Ok(Ok(data)) => results.push(data),            Ok(Err(e)) => tracing::error!("Task failed: {}", e),            Err(e) => tracing::error!("Join error: {}", e),        }    }    Ok(results)}// With concurrency limituse futures::stream::{self, StreamExt};async fn fetch_with_limit(urls: Vec<String>, limit: usize) -> Vec<Result<String>> {    stream::iter(urls)        .map(|url| async move { fetch_data(&url).await })        .buffer_unordered(limit) // Max concurrent tasks        .collect()        .await}// Select first to completeuse tokio::select;async fn race_requests(url1: &str, url2: &str) -> Result<String> {    select! {        result = fetch_data(url1) => result,        result = fetch_data(url2) => result,    }}
```
```
use tokio::sync::{mpsc, broadcast, oneshot, watch};// Multi-producer, single-consumerasync fn mpsc_example() {    let (tx, mut rx) = mpsc::channel::<String>(100);    // Spawn producer    let tx2 = tx.clone();    tokio::spawn(async move {        tx2.send("Hello".to_string()).await.unwrap();    });    // Consume    while let Some(msg) = rx.recv().await {        println!("Got: {}", msg);    }}// Broadcast: multi-producer, multi-consumerasync fn broadcast_example() {    let (tx, _) = broadcast::channel::<String>(100);    let mut rx1 = tx.subscribe();    let mut rx2 = tx.subscribe();    tx.send("Event".to_string()).unwrap();    // Both receivers get the message    let _ = rx1.recv().await;    let _ = rx2.recv().await;}// Oneshot: single value, single useasync fn oneshot_example() -> String {    let (tx, rx) = oneshot::channel::<String>();    tokio::spawn(async move {        tx.send("Result".to_string()).unwrap();    });    rx.await.unwrap()}// Watch: single producer, multi-consumer, latest valueasync fn watch_example() {    let (tx, mut rx) = watch::channel("initial".to_string());    tokio::spawn(async move {        loop {            // Wait for changes            rx.changed().await.unwrap();            println!("New value: {}", *rx.borrow());        }    });    tx.send("updated".to_string()).unwrap();}
```
```
use tokio::sync::{mpsc, broadcast, oneshot, watch};// Multi-producer, single-consumerasync fn mpsc_example() {    let (tx, mut rx) = mpsc::channel::<String>(100);    // Spawn producer    let tx2 = tx.clone();    tokio::spawn(async move {        tx2.send("Hello".to_string()).await.unwrap();    });    // Consume    while let Some(msg) = rx.recv().await {        println!("Got: {}", msg);    }}// Broadcast: multi-producer, multi-consumerasync fn broadcast_example() {    let (tx, _) = broadcast::channel::<String>(100);    let mut rx1 = tx.subscribe();    let mut rx2 = tx.subscribe();    tx.send("Event".to_string()).unwrap();    // Both receivers get the message    let _ = rx1.recv().await;    let _ = rx2.recv().await;}// Oneshot: single value, single useasync fn oneshot_example() -> String {    let (tx, rx) = oneshot::channel::<String>();    tokio::spawn(async move {        tx.send("Result".to_string()).unwrap();    });    rx.await.unwrap()}// Watch: single producer, multi-consumer, latest valueasync fn watch_example() {    let (tx, mut rx) = watch::channel("initial".to_string());    tokio::spawn(async move {        loop {            // Wait for changes            rx.changed().await.unwrap();            println!("New value: {}", *rx.borrow());        }    });    tx.send("updated".to_string()).unwrap();}
```
```
use anyhow::{Context, Result, bail};use thiserror::Error;#[derive(Error, Debug)]pub enum ServiceError {    #[error("Network error: {0}")]    Network(#[from] reqwest::Error),    #[error("Database error: {0}")]    Database(#[from] sqlx::Error),    #[error("Not found: {0}")]    NotFound(String),    #[error("Timeout after {0:?}")]    Timeout(std::time::Duration),}// Using anyhow for application errorsasync fn process_request(id: &str) -> Result<Response> {    let data = fetch_data(id)        .await        .context("Failed to fetch data")?;    let parsed = parse_response(&data)        .context("Failed to parse response")?;    Ok(parsed)}// Using custom errors for library codeasync fn get_user(id: &str) -> Result<User, ServiceError> {    let result = db.query(id).await?;    match result {        Some(user) => Ok(user),        None => Err(ServiceError::NotFound(id.to_string())),    }}// Timeout wrapperuse tokio::time::timeout;async fn with_timeout<T, F>(duration: Duration, future: F) -> Result<T, ServiceError>where    F: std::future::Future<Output = Result<T, ServiceError>>,{    timeout(duration, future)        .await        .map_err(|_| ServiceError::Timeout(duration))?}
```
```
use anyhow::{Context, Result, bail};use thiserror::Error;#[derive(Error, Debug)]pub enum ServiceError {    #[error("Network error: {0}")]    Network(#[from] reqwest::Error),    #[error("Database error: {0}")]    Database(#[from] sqlx::Error),    #[error("Not found: {0}")]    NotFound(String),    #[error("Timeout after {0:?}")]    Timeout(std::time::Duration),}// Using anyhow for application errorsasync fn process_request(id: &str) -> Result<Response> {    let data = fetch_data(id)        .await        .context("Failed to fetch data")?;    let parsed = parse_response(&data)        .context("Failed to parse response")?;    Ok(parsed)}// Using custom errors for library codeasync fn get_user(id: &str) -> Result<User, ServiceError> {    let result = db.query(id).await?;    match result {        Some(user) => Ok(user),        None => Err(ServiceError::NotFound(id.to_string())),    }}// Timeout wrapperuse tokio::time::timeout;async fn with_timeout<T, F>(duration: Duration, future: F) -> Result<T, ServiceError>where    F: std::future::Future<Output = Result<T, ServiceError>>,{    timeout(duration, future)        .await        .map_err(|_| ServiceError::Timeout(duration))?}
```
```
use tokio::signal;use tokio::sync::broadcast;use tokio_util::sync::CancellationToken;async fn run_server() -> Result<()> {    // Method 1: CancellationToken    let token = CancellationToken::new();    let token_clone = token.clone();    // Spawn task that respects cancellation    tokio::spawn(async move {        loop {            tokio::select! {                _ = token_clone.cancelled() => {                    tracing::info!("Task shutting down");                    break;                }                _ = do_work() => {}            }        }    });    // Wait for shutdown signal    signal::ctrl_c().await?;    tracing::info!("Shutdown signal received");    // Cancel all tasks    token.cancel();    // Give tasks time to cleanup    tokio::time::sleep(Duration::from_secs(5)).await;    Ok(())}// Method 2: Broadcast channel for shutdownasync fn run_with_broadcast() -> Result<()> {    let (shutdown_tx, _) = broadcast::channel::<()>(1);    let mut rx = shutdown_tx.subscribe();    tokio::spawn(async move {        tokio::select! {            _ = rx.recv() => {                tracing::info!("Received shutdown");            }            _ = async { loop { do_work().await } } => {}        }    });    signal::ctrl_c().await?;    let _ = shutdown_tx.send(());    Ok(())}
```
```
use tokio::signal;use tokio::sync::broadcast;use tokio_util::sync::CancellationToken;async fn run_server() -> Result<()> {    // Method 1: CancellationToken    let token = CancellationToken::new();    let token_clone = token.clone();    // Spawn task that respects cancellation    tokio::spawn(async move {        loop {            tokio::select! {                _ = token_clone.cancelled() => {                    tracing::info!("Task shutting down");                    break;                }                _ = do_work() => {}            }        }    });    // Wait for shutdown signal    signal::ctrl_c().await?;    tracing::info!("Shutdown signal received");    // Cancel all tasks    token.cancel();    // Give tasks time to cleanup    tokio::time::sleep(Duration::from_secs(5)).await;    Ok(())}// Method 2: Broadcast channel for shutdownasync fn run_with_broadcast() -> Result<()> {    let (shutdown_tx, _) = broadcast::channel::<()>(1);    let mut rx = shutdown_tx.subscribe();    tokio::spawn(async move {        tokio::select! {            _ = rx.recv() => {                tracing::info!("Received shutdown");            }            _ = async { loop { do_work().await } } => {}        }    });    signal::ctrl_c().await?;    let _ = shutdown_tx.send(());    Ok(())}
```
```
use async_trait::async_trait;#[async_trait]pub trait Repository {    async fn get(&self, id: &str) -> Result<Entity>;    async fn save(&self, entity: &Entity) -> Result<()>;    async fn delete(&self, id: &str) -> Result<()>;}pub struct PostgresRepository {    pool: sqlx::PgPool,}#[async_trait]impl Repository for PostgresRepository {    async fn get(&self, id: &str) -> Result<Entity> {        sqlx::query_as!(Entity, "SELECT * FROM entities WHERE id = $1", id)            .fetch_one(&self.pool)            .await            .map_err(Into::into)    }    async fn save(&self, entity: &Entity) -> Result<()> {        sqlx::query!(            "INSERT INTO entities (id, data) VALUES ($1, $2)             ON CONFLICT (id) DO UPDATE SET data = $2",            entity.id,            entity.data        )        .execute(&self.pool)        .await?;        Ok(())    }    async fn delete(&self, id: &str) -> Result<()> {        sqlx::query!("DELETE FROM entities WHERE id = $1", id)            .execute(&self.pool)            .await?;        Ok(())    }}// Trait object usageasync fn process(repo: &dyn Repository, id: &str) -> Result<()> {    let entity = repo.get(id).await?;    // Process...    repo.save(&entity).await}
```
```
use async_trait::async_trait;#[async_trait]pub trait Repository {    async fn get(&self, id: &str) -> Result<Entity>;    async fn save(&self, entity: &Entity) -> Result<()>;    async fn delete(&self, id: &str) -> Result<()>;}pub struct PostgresRepository {    pool: sqlx::PgPool,}#[async_trait]impl Repository for PostgresRepository {    async fn get(&self, id: &str) -> Result<Entity> {        sqlx::query_as!(Entity, "SELECT * FROM entities WHERE id = $1", id)            .fetch_one(&self.pool)            .await            .map_err(Into::into)    }    async fn save(&self, entity: &Entity) -> Result<()> {        sqlx::query!(            "INSERT INTO entities (id, data) VALUES ($1, $2)             ON CONFLICT (id) DO UPDATE SET data = $2",            entity.id,            entity.data        )        .execute(&self.pool)        .await?;        Ok(())    }    async fn delete(&self, id: &str) -> Result<()> {        sqlx::query!("DELETE FROM entities WHERE id = $1", id)            .execute(&self.pool)            .await?;        Ok(())    }}// Trait object usageasync fn process(repo: &dyn Repository, id: &str) -> Result<()> {    let entity = repo.get(id).await?;    // Process...    repo.save(&entity).await}
```
```
use futures::stream::{self, Stream, StreamExt};use async_stream::stream;// Create stream from async iteratorfn numbers_stream() -> impl Stream<Item = i32> {    stream! {        for i in 0..10 {            tokio::time::sleep(Duration::from_millis(100)).await;            yield i;        }    }}// Process streamasync fn process_stream() {    let stream = numbers_stream();    // Map and filter    let processed: Vec<_> = stream        .filter(|n| futures::future::ready(*n % 2 == 0))        .map(|n| n * 2)        .collect()        .await;    println!("{:?}", processed);}// Chunked processingasync fn process_in_chunks() {    let stream = numbers_stream();    let mut chunks = stream.chunks(3);    while let Some(chunk) = chunks.next().await {        println!("Processing chunk: {:?}", chunk);    }}// Merge multiple streamsasync fn merge_streams() {    let stream1 = numbers_stream();    let stream2 = numbers_stream();    let merged = stream::select(stream1, stream2);    merged        .for_each(|n| async move {            println!("Got: {}", n);        })        .await;}
```
```
use futures::stream::{self, Stream, StreamExt};use async_stream::stream;// Create stream from async iteratorfn numbers_stream() -> impl Stream<Item = i32> {    stream! {        for i in 0..10 {            tokio::time::sleep(Duration::from_millis(100)).await;            yield i;        }    }}// Process streamasync fn process_stream() {    let stream = numbers_stream();    // Map and filter    let processed: Vec<_> = stream        .filter(|n| futures::future::ready(*n % 2 == 0))        .map(|n| n * 2)        .collect()        .await;    println!("{:?}", processed);}// Chunked processingasync fn process_in_chunks() {    let stream = numbers_stream();    let mut chunks = stream.chunks(3);    while let Some(chunk) = chunks.next().await {        println!("Processing chunk: {:?}", chunk);    }}// Merge multiple streamsasync fn merge_streams() {    let stream1 = numbers_stream();    let stream2 = numbers_stream();    let merged = stream::select(stream1, stream2);    merged        .for_each(|n| async move {            println!("Got: {}", n);        })        .await;}
```
```
use std::sync::Arc;use tokio::sync::{Mutex, RwLock, Semaphore};// Shared state with RwLock (prefer for read-heavy)struct Cache {    data: RwLock<HashMap<String, String>>,}impl Cache {    async fn get(&self, key: &str) -> Option<String> {        self.data.read().await.get(key).cloned()    }    async fn set(&self, key: String, value: String) {        self.data.write().await.insert(key, value);    }}// Connection pool with semaphorestruct Pool {    semaphore: Semaphore,    connections: Mutex<Vec<Connection>>,}impl Pool {    fn new(size: usize) -> Self {        Self {            semaphore: Semaphore::new(size),            connections: Mutex::new((0..size).map(|_| Connection::new()).collect()),        }    }    async fn acquire(&self) -> PooledConnection<'_> {        let permit = self.semaphore.acquire().await.unwrap();        let conn = self.connections.lock().await.pop().unwrap();        PooledConnection { pool: self, conn: Some(conn), _permit: permit }    }}struct PooledConnection<'a> {    pool: &'a Pool,    conn: Option<Connection>,    _permit: tokio::sync::SemaphorePermit<'a>,}impl Drop for PooledConnection<'_> {    fn drop(&mut self) {        if let Some(conn) = self.conn.take() {            let pool = self.pool;            tokio::spawn(async move {                pool.connections.lock().await.push(conn);            });        }    }}
```
```
use std::sync::Arc;use tokio::sync::{Mutex, RwLock, Semaphore};// Shared state with RwLock (prefer for read-heavy)struct Cache {    data: RwLock<HashMap<String, String>>,}impl Cache {    async fn get(&self, key: &str) -> Option<String> {        self.data.read().await.get(key).cloned()    }    async fn set(&self, key: String, value: String) {        self.data.write().await.insert(key, value);    }}// Connection pool with semaphorestruct Pool {    semaphore: Semaphore,    connections: Mutex<Vec<Connection>>,}impl Pool {    fn new(size: usize) -> Self {        Self {            semaphore: Semaphore::new(size),            connections: Mutex::new((0..size).map(|_| Connection::new()).collect()),        }    }    async fn acquire(&self) -> PooledConnection<'_> {        let permit = self.semaphore.acquire().await.unwrap();        let conn = self.connections.lock().await.pop().unwrap();        PooledConnection { pool: self, conn: Some(conn), _permit: permit }    }}struct PooledConnection<'a> {    pool: &'a Pool,    conn: Option<Connection>,    _permit: tokio::sync::SemaphorePermit<'a>,}impl Drop for PooledConnection<'_> {    fn drop(&mut self) {        if let Some(conn) = self.conn.take() {            let pool = self.pool;            tokio::spawn(async move {                pool.connections.lock().await.push(conn);            });        }    }}
```
```
// Enable tokio-console for runtime debugging// Cargo.toml: tokio = { features = ["tracing"] }// Run: RUSTFLAGS="--cfg tokio_unstable" cargo run// Then: tokio-console// Instrument async functionsuse tracing::instrument;#[instrument(skip(pool))]async fn fetch_user(pool: &PgPool, id: &str) -> Result<User> {    tracing::debug!("Fetching user");    // ...}// Track task spawninglet span = tracing::info_span!("worker", id = %worker_id);tokio::spawn(async move {    // Enters span when polled}.instrument(span));
```
```
// Enable tokio-console for runtime debugging// Cargo.toml: tokio = { features = ["tracing"] }// Run: RUSTFLAGS="--cfg tokio_unstable" cargo run// Then: tokio-console// Instrument async functionsuse tracing::instrument;#[instrument(skip(pool))]async fn fetch_user(pool: &PgPool, id: &str) -> Result<User> {    tracing::debug!("Fetching user");    // ...}// Track task spawninglet span = tracing::info_span!("worker", id = %worker_id);tokio::spawn(async move {    // Enters span when polled}.instrument(span));
```
```
tokio::select!
```
```
JoinSet
```
```
CancellationToken
```
```
std::thread::sleep
```
```
?
```
Dive deep into the sophisticated world of asynchronous programming in Rust with this comprehensive agent skill. Engineered for developers seeking to build high-performance, concurrent applications, it demystifies complex async concepts like Futures, Wakers, and the Tokio runtime. You'll gain practical expertise in implementing robust async traits, managing concurrent tasks, and handling errors gracefully, ensuring your Rust applications are both efficient and resilient. This skill empowers you to leverage Rust's full potential for modern, scalable system development.

# When to Use This Skill
- •Developing high-performance network servers or microservices in Rust.
- •Integrating external APIs or databases using async/await syntax.
- •Building efficient command-line tools that perform I/O operations concurrently.
- •Optimizing existing Rust applications for better responsiveness and throughput.

# Pro Tips
- 💡Always design your async boundaries carefully: prefer `spawn` for top-level tasks and `join!` for awaiting multiple related futures.
- 💡Leverage structured concurrency patterns (like `tokio::select!`) to manage the lifecycle of concurrent operations and prevent leaked tasks.
- 💡Utilize `tracing` for observable async code; it's invaluable for debugging complex concurrent flows and understanding performance bottlenecks.


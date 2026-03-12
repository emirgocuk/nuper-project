# mobile-android-design
Source: https://antigravity.codes/agent-skills/mobile/mobile-android-design

## AI Worker Instructions
When the user requests functionality related to mobile-android-design, follow these guidelines and utilize this context.

## Scraped Content

# mobile-android-design
```
// Vertical arrangement with alignmentColumn(    modifier = Modifier.padding(16.dp),    verticalArrangement = Arrangement.spacedBy(12.dp),    horizontalAlignment = Alignment.Start) {    Text(        text = "Title",        style = MaterialTheme.typography.headlineSmall    )    Text(        text = "Subtitle",        style = MaterialTheme.typography.bodyMedium,        color = MaterialTheme.colorScheme.onSurfaceVariant    )}// Horizontal arrangement with weightRow(    modifier = Modifier.fillMaxWidth(),    horizontalArrangement = Arrangement.SpaceBetween,    verticalAlignment = Alignment.CenterVertically) {    Icon(Icons.Default.Star, contentDescription = null)    Text("Featured")    Spacer(modifier = Modifier.weight(1f))    TextButton(onClick = {}) {        Text("View All")    }}
```
```
// Vertical arrangement with alignmentColumn(    modifier = Modifier.padding(16.dp),    verticalArrangement = Arrangement.spacedBy(12.dp),    horizontalAlignment = Alignment.Start) {    Text(        text = "Title",        style = MaterialTheme.typography.headlineSmall    )    Text(        text = "Subtitle",        style = MaterialTheme.typography.bodyMedium,        color = MaterialTheme.colorScheme.onSurfaceVariant    )}// Horizontal arrangement with weightRow(    modifier = Modifier.fillMaxWidth(),    horizontalArrangement = Arrangement.SpaceBetween,    verticalAlignment = Alignment.CenterVertically) {    Icon(Icons.Default.Star, contentDescription = null)    Text("Featured")    Spacer(modifier = Modifier.weight(1f))    TextButton(onClick = {}) {        Text("View All")    }}
```
```
// Lazy column with sticky headersLazyColumn {    items.groupBy { it.category }.forEach { (category, categoryItems) ->        stickyHeader {            Text(                text = category,                modifier = Modifier                    .fillMaxWidth()                    .background(MaterialTheme.colorScheme.surface)                    .padding(16.dp),                style = MaterialTheme.typography.titleMedium            )        }        items(categoryItems) { item ->            ItemRow(item = item)        }    }}// Adaptive gridLazyVerticalGrid(    columns = GridCells.Adaptive(minSize = 150.dp),    contentPadding = PaddingValues(16.dp),    horizontalArrangement = Arrangement.spacedBy(12.dp),    verticalArrangement = Arrangement.spacedBy(12.dp)) {    items(items) { item ->        ItemCard(item = item)    }}
```
```
// Lazy column with sticky headersLazyColumn {    items.groupBy { it.category }.forEach { (category, categoryItems) ->        stickyHeader {            Text(                text = category,                modifier = Modifier                    .fillMaxWidth()                    .background(MaterialTheme.colorScheme.surface)                    .padding(16.dp),                style = MaterialTheme.typography.titleMedium            )        }        items(categoryItems) { item ->            ItemRow(item = item)        }    }}// Adaptive gridLazyVerticalGrid(    columns = GridCells.Adaptive(minSize = 150.dp),    contentPadding = PaddingValues(16.dp),    horizontalArrangement = Arrangement.spacedBy(12.dp),    verticalArrangement = Arrangement.spacedBy(12.dp)) {    items(items) { item ->        ItemCard(item = item)    }}
```
```
@Composablefun MainScreen() {    val navController = rememberNavController()    Scaffold(        bottomBar = {            NavigationBar {                val navBackStackEntry by navController.currentBackStackEntryAsState()                val currentDestination = navBackStackEntry?.destination                NavigationDestination.entries.forEach { destination ->                    NavigationBarItem(                        icon = { Icon(destination.icon, contentDescription = null) },                        label = { Text(destination.label) },                        selected = currentDestination?.hierarchy?.any {                            it.route == destination.route                        } == true,                        onClick = {                            navController.navigate(destination.route) {                                popUpTo(navController.graph.findStartDestination().id) {                                    saveState = true                                }                                launchSingleTop = true                                restoreState = true                            }                        }                    )                }            }        }    ) { innerPadding ->        NavHost(            navController = navController,            startDestination = NavigationDestination.Home.route,            modifier = Modifier.padding(innerPadding)        ) {            composable(NavigationDestination.Home.route) { HomeScreen() }            composable(NavigationDestination.Search.route) { SearchScreen() }            composable(NavigationDestination.Profile.route) { ProfileScreen() }        }    }}
```
```
@Composablefun MainScreen() {    val navController = rememberNavController()    Scaffold(        bottomBar = {            NavigationBar {                val navBackStackEntry by navController.currentBackStackEntryAsState()                val currentDestination = navBackStackEntry?.destination                NavigationDestination.entries.forEach { destination ->                    NavigationBarItem(                        icon = { Icon(destination.icon, contentDescription = null) },                        label = { Text(destination.label) },                        selected = currentDestination?.hierarchy?.any {                            it.route == destination.route                        } == true,                        onClick = {                            navController.navigate(destination.route) {                                popUpTo(navController.graph.findStartDestination().id) {                                    saveState = true                                }                                launchSingleTop = true                                restoreState = true                            }                        }                    )                }            }        }    ) { innerPadding ->        NavHost(            navController = navController,            startDestination = NavigationDestination.Home.route,            modifier = Modifier.padding(innerPadding)        ) {            composable(NavigationDestination.Home.route) { HomeScreen() }            composable(NavigationDestination.Search.route) { SearchScreen() }            composable(NavigationDestination.Profile.route) { ProfileScreen() }        }    }}
```
```
@Composablefun DrawerNavigation() {    val drawerState = rememberDrawerState(DrawerValue.Closed)    val scope = rememberCoroutineScope()    ModalNavigationDrawer(        drawerState = drawerState,        drawerContent = {            ModalDrawerSheet {                Spacer(Modifier.height(12.dp))                Text(                    "App Name",                    modifier = Modifier.padding(16.dp),                    style = MaterialTheme.typography.titleLarge                )                HorizontalDivider()                NavigationDrawerItem(                    icon = { Icon(Icons.Default.Home, null) },                    label = { Text("Home") },                    selected = true,                    onClick = { scope.launch { drawerState.close() } }                )                NavigationDrawerItem(                    icon = { Icon(Icons.Default.Settings, null) },                    label = { Text("Settings") },                    selected = false,                    onClick = { }                )            }        }    ) {        Scaffold(            topBar = {                TopAppBar(                    title = { Text("Home") },                    navigationIcon = {                        IconButton(onClick = { scope.launch { drawerState.open() } }) {                            Icon(Icons.Default.Menu, contentDescription = "Menu")                        }                    }                )            }        ) { innerPadding ->            Content(modifier = Modifier.padding(innerPadding))        }    }}
```
```
@Composablefun DrawerNavigation() {    val drawerState = rememberDrawerState(DrawerValue.Closed)    val scope = rememberCoroutineScope()    ModalNavigationDrawer(        drawerState = drawerState,        drawerContent = {            ModalDrawerSheet {                Spacer(Modifier.height(12.dp))                Text(                    "App Name",                    modifier = Modifier.padding(16.dp),                    style = MaterialTheme.typography.titleLarge                )                HorizontalDivider()                NavigationDrawerItem(                    icon = { Icon(Icons.Default.Home, null) },                    label = { Text("Home") },                    selected = true,                    onClick = { scope.launch { drawerState.close() } }                )                NavigationDrawerItem(                    icon = { Icon(Icons.Default.Settings, null) },                    label = { Text("Settings") },                    selected = false,                    onClick = { }                )            }        }    ) {        Scaffold(            topBar = {                TopAppBar(                    title = { Text("Home") },                    navigationIcon = {                        IconButton(onClick = { scope.launch { drawerState.open() } }) {                            Icon(Icons.Default.Menu, contentDescription = "Menu")                        }                    }                )            }        ) { innerPadding ->            Content(modifier = Modifier.padding(innerPadding))        }    }}
```
```
// Dynamic color (Android 12+)val dynamicColorScheme = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {    val context = LocalContext.current    if (darkTheme) dynamicDarkColorScheme(context)    else dynamicLightColorScheme(context)} else {    if (darkTheme) DarkColorScheme else LightColorScheme}// Custom color schemeprivate val LightColorScheme = lightColorScheme(    primary = Color(0xFF6750A4),    onPrimary = Color.White,    primaryContainer = Color(0xFFEADDFF),    onPrimaryContainer = Color(0xFF21005D),    secondary = Color(0xFF625B71),    onSecondary = Color.White,    tertiary = Color(0xFF7D5260),    onTertiary = Color.White,    surface = Color(0xFFFFFBFE),    onSurface = Color(0xFF1C1B1F),)
```
```
// Dynamic color (Android 12+)val dynamicColorScheme = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {    val context = LocalContext.current    if (darkTheme) dynamicDarkColorScheme(context)    else dynamicLightColorScheme(context)} else {    if (darkTheme) DarkColorScheme else LightColorScheme}// Custom color schemeprivate val LightColorScheme = lightColorScheme(    primary = Color(0xFF6750A4),    onPrimary = Color.White,    primaryContainer = Color(0xFFEADDFF),    onPrimaryContainer = Color(0xFF21005D),    secondary = Color(0xFF625B71),    onSecondary = Color.White,    tertiary = Color(0xFF7D5260),    onTertiary = Color.White,    surface = Color(0xFFFFFBFE),    onSurface = Color(0xFF1C1B1F),)
```
```
val AppTypography = Typography(    displayLarge = TextStyle(        fontFamily = FontFamily.Default,        fontWeight = FontWeight.Normal,        fontSize = 57.sp,        lineHeight = 64.sp    ),    headlineMedium = TextStyle(        fontFamily = FontFamily.Default,        fontWeight = FontWeight.Normal,        fontSize = 28.sp,        lineHeight = 36.sp    ),    titleLarge = TextStyle(        fontFamily = FontFamily.Default,        fontWeight = FontWeight.Normal,        fontSize = 22.sp,        lineHeight = 28.sp    ),    bodyLarge = TextStyle(        fontFamily = FontFamily.Default,        fontWeight = FontWeight.Normal,        fontSize = 16.sp,        lineHeight = 24.sp    ),    labelMedium = TextStyle(        fontFamily = FontFamily.Default,        fontWeight = FontWeight.Medium,        fontSize = 12.sp,        lineHeight = 16.sp    ))
```
```
val AppTypography = Typography(    displayLarge = TextStyle(        fontFamily = FontFamily.Default,        fontWeight = FontWeight.Normal,        fontSize = 57.sp,        lineHeight = 64.sp    ),    headlineMedium = TextStyle(        fontFamily = FontFamily.Default,        fontWeight = FontWeight.Normal,        fontSize = 28.sp,        lineHeight = 36.sp    ),    titleLarge = TextStyle(        fontFamily = FontFamily.Default,        fontWeight = FontWeight.Normal,        fontSize = 22.sp,        lineHeight = 28.sp    ),    bodyLarge = TextStyle(        fontFamily = FontFamily.Default,        fontWeight = FontWeight.Normal,        fontSize = 16.sp,        lineHeight = 24.sp    ),    labelMedium = TextStyle(        fontFamily = FontFamily.Default,        fontWeight = FontWeight.Medium,        fontSize = 12.sp,        lineHeight = 16.sp    ))
```
```
@Composablefun FeatureCard(    title: String,    description: String,    imageUrl: String,    onClick: () -> Unit) {    Card(        onClick = onClick,        modifier = Modifier.fillMaxWidth(),        shape = RoundedCornerShape(16.dp),        colors = CardDefaults.cardColors(            containerColor = MaterialTheme.colorScheme.surfaceVariant        )    ) {        Column {            AsyncImage(                model = imageUrl,                contentDescription = null,                modifier = Modifier                    .fillMaxWidth()                    .height(180.dp),                contentScale = ContentScale.Crop            )            Column(modifier = Modifier.padding(16.dp)) {                Text(                    text = title,                    style = MaterialTheme.typography.titleMedium                )                Spacer(modifier = Modifier.height(8.dp))                Text(                    text = description,                    style = MaterialTheme.typography.bodyMedium,                    color = MaterialTheme.colorScheme.onSurfaceVariant                )            }        }    }}
```
```
@Composablefun FeatureCard(    title: String,    description: String,    imageUrl: String,    onClick: () -> Unit) {    Card(        onClick = onClick,        modifier = Modifier.fillMaxWidth(),        shape = RoundedCornerShape(16.dp),        colors = CardDefaults.cardColors(            containerColor = MaterialTheme.colorScheme.surfaceVariant        )    ) {        Column {            AsyncImage(                model = imageUrl,                contentDescription = null,                modifier = Modifier                    .fillMaxWidth()                    .height(180.dp),                contentScale = ContentScale.Crop            )            Column(modifier = Modifier.padding(16.dp)) {                Text(                    text = title,                    style = MaterialTheme.typography.titleMedium                )                Spacer(modifier = Modifier.height(8.dp))                Text(                    text = description,                    style = MaterialTheme.typography.bodyMedium,                    color = MaterialTheme.colorScheme.onSurfaceVariant                )            }        }    }}
```
```
// Filled button (primary action)Button(onClick = { }) {    Text("Continue")}// Filled tonal button (secondary action)FilledTonalButton(onClick = { }) {    Icon(Icons.Default.Add, null)    Spacer(Modifier.width(8.dp))    Text("Add Item")}// Outlined buttonOutlinedButton(onClick = { }) {    Text("Cancel")}// Text buttonTextButton(onClick = { }) {    Text("Learn More")}// FABFloatingActionButton(    onClick = { },    containerColor = MaterialTheme.colorScheme.primaryContainer,    contentColor = MaterialTheme.colorScheme.onPrimaryContainer) {    Icon(Icons.Default.Add, contentDescription = "Add")}
```
```
// Filled button (primary action)Button(onClick = { }) {    Text("Continue")}// Filled tonal button (secondary action)FilledTonalButton(onClick = { }) {    Icon(Icons.Default.Add, null)    Spacer(Modifier.width(8.dp))    Text("Add Item")}// Outlined buttonOutlinedButton(onClick = { }) {    Text("Cancel")}// Text buttonTextButton(onClick = { }) {    Text("Learn More")}// FABFloatingActionButton(    onClick = { },    containerColor = MaterialTheme.colorScheme.primaryContainer,    contentColor = MaterialTheme.colorScheme.onPrimaryContainer) {    Icon(Icons.Default.Add, contentDescription = "Add")}
```
```
@Composablefun ItemListCard(    item: Item,    onItemClick: () -> Unit,    modifier: Modifier = Modifier) {    Card(        onClick = onItemClick,        modifier = modifier.fillMaxWidth(),        shape = RoundedCornerShape(12.dp)    ) {        Row(            modifier = Modifier                .padding(16.dp)                .fillMaxWidth(),            verticalAlignment = Alignment.CenterVertically        ) {            Box(                modifier = Modifier                    .size(48.dp)                    .clip(CircleShape)                    .background(MaterialTheme.colorScheme.primaryContainer),                contentAlignment = Alignment.Center            ) {                Icon(                    imageVector = Icons.Default.Star,                    contentDescription = null,                    tint = MaterialTheme.colorScheme.onPrimaryContainer                )            }            Spacer(modifier = Modifier.width(16.dp))            Column(modifier = Modifier.weight(1f)) {                Text(                    text = item.title,                    style = MaterialTheme.typography.titleMedium                )                Text(                    text = item.subtitle,                    style = MaterialTheme.typography.bodyMedium,                    color = MaterialTheme.colorScheme.onSurfaceVariant                )            }            Icon(                imageVector = Icons.Default.ChevronRight,                contentDescription = null,                tint = MaterialTheme.colorScheme.onSurfaceVariant            )        }    }}
```
```
@Composablefun ItemListCard(    item: Item,    onItemClick: () -> Unit,    modifier: Modifier = Modifier) {    Card(        onClick = onItemClick,        modifier = modifier.fillMaxWidth(),        shape = RoundedCornerShape(12.dp)    ) {        Row(            modifier = Modifier                .padding(16.dp)                .fillMaxWidth(),            verticalAlignment = Alignment.CenterVertically        ) {            Box(                modifier = Modifier                    .size(48.dp)                    .clip(CircleShape)                    .background(MaterialTheme.colorScheme.primaryContainer),                contentAlignment = Alignment.Center            ) {                Icon(                    imageVector = Icons.Default.Star,                    contentDescription = null,                    tint = MaterialTheme.colorScheme.onPrimaryContainer                )            }            Spacer(modifier = Modifier.width(16.dp))            Column(modifier = Modifier.weight(1f)) {                Text(                    text = item.title,                    style = MaterialTheme.typography.titleMedium                )                Text(                    text = item.subtitle,                    style = MaterialTheme.typography.bodyMedium,                    color = MaterialTheme.colorScheme.onSurfaceVariant                )            }            Icon(                imageVector = Icons.Default.ChevronRight,                contentDescription = null,                tint = MaterialTheme.colorScheme.onSurfaceVariant            )        }    }}
```
```
MaterialTheme.colorScheme
```
```
WindowSizeClass
```
```
contentDescription
```
```
remember
```
```
rememberSaveable
```
```
@Preview
```
```
remember
```
```
rememberSaveable
```
```
LazyColumn
```
```
Column
```
```
MaterialTheme
```
```
DisposableEffect
```
For developers aiming to craft visually stunning and highly functional Android applications, mastering the synergy between Material Design 3 and Jetpack Compose is paramount. This agent skill empowers you to navigate the complexities of modern Android UI/UX, ensuring your apps are not only aesthetically pleasing but also adaptive, accessible, and deeply integrated into the Android ecosystem. Leverage its guidance to build intuitive interfaces that respond elegantly across diverse devices, providing users with a seamless and personalized experience that stands out in today's mobile landscape.

# When to Use This Skill
- •Designing new Android application interfaces according to the latest Material Design 3 specifications.
- •Implementing dynamic and responsive layouts using Jetpack Compose for various screen sizes like phones, tablets, and foldables.
- •Applying Material 3 theming, including dynamic colors, to create a personalized user experience.
- •Building accessible Android interfaces and implementing Android-specific gestures and interactions.

# Pro Tips
- 💡Always prioritize semantic composables (e.g., `Button`, `Card`, `Scaffold`) over raw `Box`/`Column`/`Row` for better accessibility and maintainability.
- 💡Embrace Modifier chaining to create concise and readable UI definitions, enhancing performance by reducing unnecessary recompositions.
- 💡Leverage the Android Studio Compose Preview extensively for rapid UI iteration and testing across different configurations (dark mode, locales, screen sizes) before deploying to a device.


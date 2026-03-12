# Setup RBAC
Source: https://antigravity.codes/workflows/production/setup-role-based-access-control-rbac

## AI Worker Instructions
When the user requests functionality related to Setup RBAC, follow these guidelines and utilize this context.

## Scraped Content

# Setup RBAC
```
enum Role {     USER     ADMIN     MODERATOR   }
```
```
enum Role {     USER     ADMIN     MODERATOR   }
```
```
if (session?.user?.role !== 'ADMIN') {     return Response.json({ error: 'Forbidden' }, { status: 403 });   }
```
```
if (session?.user?.role !== 'ADMIN') {     return Response.json({ error: 'Forbidden' }, { status: 403 });   }
```
```
{isAdmin && <AdminPanel />}
```
```
{isAdmin && <AdminPanel />}
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as setup-role-based-access-control-rbac.md
```
setup-role-based-access-control-rbac.md
```
- In Antigravity, type /setup_role_based_access_control_rbac or just describe what you want to do
```
/setup_role_based_access_control_rbac
```
Learn more about workflows →

# Related Workflows

# Security Hardening Checklist

# Implement Rate Limiting

# Secure API from CSRF


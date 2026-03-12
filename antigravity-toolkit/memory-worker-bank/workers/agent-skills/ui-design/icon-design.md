# icon-design
Source: https://antigravity.codes/agent-skills/ui-design/icon-design

## AI Worker Instructions
When the user requests functionality related to icon-design, follow these guidelines and utilize this context.

## Scraped Content

# icon-design
```
Trophy
```
```
trophy
```
```
Trophy
```
```
Tag
```
```
tag
```
```
Tag
```
```
MapPin
```
```
map-pin
```
```
MapPin
```
```
GraduationCap
```
```
academic-cap
```
```
GraduationCap
```
```
MessageCircle
```
```
chat-bubble-left-right
```
```
ChatCircle
```
```
Shield
```
```
shield-check
```
```
Shield
```
```
Zap
```
```
bolt
```
```
Lightning
```
```
Phone
```
```
phone
```
```
Phone
```
```
Mail
```
```
envelope
```
```
Envelope
```
```
User
```
```
user
```
```
User
```
```
Users
```
```
user-group
```
```
Users
```
```
Settings
```
```
cog-6-tooth
```
```
Gear
```
```
Home
```
```
home
```
```
House
```
```
Search
```
```
magnifying-glass
```
```
MagnifyingGlass
```
```
Check
```
```
check
```
```
Check
```
```
X
```
```
x-mark
```
```
X
```
```
Menu
```
```
bars-3
```
```
List
```
```
Calendar
```
```
calendar
```
```
Calendar
```
```
Clock
```
```
clock
```
```
Clock
```
```
Heart
```
```
heart
```
```
Heart
```
```
lucide-react
```
```
@heroicons/react
```
```
@phosphor-icons/react
```
```
references/library-comparison.md
```
```
w-4 h-4
```
```
w-5 h-5
```
```
w-8 h-8
```
```
w-10 h-10
```
```
w-12 h-12
```
```
w-16 h-16
```
```
stroke="currentColor"
```
```
text-primary
```
```
text-blue-500
```
```
// BAD - all icons bundledimport * as Icons from 'lucide-react'const Icon = Icons[iconName]  // Tree-shaken away!// GOOD - explicit mapimport { Home, Users, Settings, type LucideIcon } from 'lucide-react'const ICON_MAP: Record<string, LucideIcon> = { Home, Users, Settings }const Icon = ICON_MAP[iconName]
```
```
// BAD - all icons bundledimport * as Icons from 'lucide-react'const Icon = Icons[iconName]  // Tree-shaken away!// GOOD - explicit mapimport { Home, Users, Settings, type LucideIcon } from 'lucide-react'const ICON_MAP: Record<string, LucideIcon> = { Home, Users, Settings }const Icon = ICON_MAP[iconName]
```
```
references/semantic-mapping.md
```
```
references/icon-templates.md
```
```
Is it about recognition/awards? → Trophy, Star, AwardIs it about money/price? → Tag, DollarSign, CreditCardIs it about location? → MapPin, Globe, MapIs it about people/team? → Users, UserGroup, UserIs it about communication? → MessageCircle, Phone, MailIs it about safety/trust? → Shield, Lock, ShieldCheckIs it about speed/time? → Zap, Clock, TimerIs it trade-specific? → Check semantic-mapping.mdStill unsure? → CheckCircle (generic positive) or Sparkles (generic feature)
```
```
Is it about recognition/awards? → Trophy, Star, AwardIs it about money/price? → Tag, DollarSign, CreditCardIs it about location? → MapPin, Globe, MapIs it about people/team? → Users, UserGroup, UserIs it about communication? → MessageCircle, Phone, MailIs it about safety/trust? → Shield, Lock, ShieldCheckIs it about speed/time? → Zap, Clock, TimerIs it trade-specific? → Check semantic-mapping.mdStill unsure? → CheckCircle (generic positive) or Sparkles (generic feature)
```
```
references/semantic-mapping.md
```
```
references/icon-templates.md
```
```
references/library-comparison.md
```
```
references/migration-guide.md
```
```
rules/icon-design.md
```
```
<span>✅</span>
```
```
<Check className="w-4 h-4" />
```
```
<span>⚠️</span>
```
```
<AlertTriangle className="w-4 h-4" />
```
```
✉️ Email
```
```
<Mail className="w-4 h-4" /> Email
```
```
📍 Location
```
```
<MapPin className="w-4 h-4" /> Location
```
```
import * as Icons from 'lucide-react'
```
```
Icons[iconName]
```
```
ICON_MAP
```
```
require('lucide-react')[name]
```
```
import { Home, User, Settings, type LucideIcon } from 'lucide-react'const ICON_MAP: Record<string, LucideIcon> = {  home: Home,  user: User,  settings: Settings,}const Icon = ICON_MAP[iconName]if (!Icon) throw new Error(Unknown icon: ${iconName})
```
```
import { Home, User, Settings, type LucideIcon } from 'lucide-react'const ICON_MAP: Record<string, LucideIcon> = {  home: Home,  user: User,  settings: Settings,}const Icon = ICON_MAP[iconName]if (!Icon) throw new Error(Unknown icon: ${iconName})
```
```
Unknown icon: ${iconName}
```
```
className="text-blue-500"
```
```
className="text-primary"
```
```
className="text-gray-500"
```
```
className="text-muted-foreground"
```
```
className="text-red-500"
```
```
className="text-destructive"
```
```
stroke="#3B82F6"
```
```
className="text-primary"
```
```
w-4 h-4
```
```
w-5 h-5
```
```
w-6 h-6
```
```
w-8 h-8
```
```
w-10 h-10
```
```
w-12 h-12
```
```
size={24}
```
```
className="w-6 h-6"
```
```
width="20" height="20"
```
```
className="w-5 h-5"
```
```
CheckIcon
```
```
HomeIcon
```
```
/24/outline
```
```
/24/solid
```
```
weight="fill"
```
```
weight="regular"
```
```
@heroicons/react/outline
```
```
@heroicons/react/24/outline
```
```
@heroicons/react/solid
```
```
@heroicons/react/24/solid
```
```
import { Home }
```
```
import { HomeIcon }
```
```
// 24px outline (default)import { HomeIcon } from '@heroicons/react/24/outline'// 24px solidimport { HomeIcon } from '@heroicons/react/24/solid'// 20px solid (mini)import { HomeIcon } from '@heroicons/react/20/solid'
```
```
// 24px outline (default)import { HomeIcon } from '@heroicons/react/24/outline'// 24px solidimport { HomeIcon } from '@heroicons/react/24/solid'// 20px solid (mini)import { HomeIcon } from '@heroicons/react/20/solid'
```
```
<Icon />
```
```
<Icon aria-hidden="true" />
```
```
aria-label
```
```
aria-label="Description"
```
```
// Decorative icon (alongside text)<span className="flex items-center gap-2">  <Phone aria-hidden="true" className="w-4 h-4" />  <span>Call us</span></span>// Icon-only button<button aria-label="Open menu">  <Menu className="w-6 h-6" /></button>// Meaningful standalone icon<CheckCircle aria-label="Completed" className="w-5 h-5 text-green-500" />
```
```
// Decorative icon (alongside text)<span className="flex items-center gap-2">  <Phone aria-hidden="true" className="w-4 h-4" />  <span>Call us</span></span>// Icon-only button<button aria-label="Open menu">  <Menu className="w-6 h-6" /></button>// Meaningful standalone icon<CheckCircle aria-label="Completed" className="w-5 h-5 text-green-500" />
```
```
title
```
```
<Trophy title="Award" />
```
```
<span title="Award"><Trophy /></span>
```
```
<Icon aria-label="..." />
```
```
stroke="#000000"
```
```
fill="blue"
```
```
className="text-primary"
```
This agent skill revolutionizes how developers and designers integrate visual elements into their applications. By offering intelligent suggestions for icons across popular libraries like Lucide, Heroicons, and Phosphor, it streamlines the design process. Forget endless browsing; simply describe your concept, and the skill provides suitable options, ensuring consistency and clarity in your user interface. It also highlights common pitfalls, guiding you to make visually effective and semantically appropriate choices for any project.

# When to Use This Skill
- •When starting a new feature and needing appropriate icons for functionality.
- •When refactoring existing UI and wanting to improve icon consistency or update to a new library.
- •When designing UI mockups or prototyping, to quickly get visual representations.
- •When migrating between different icon libraries and needing equivalent icon suggestions.

# Pro Tips
- 💡Always provide the context of the icon's use (e.g., 'icon for a new message notification in a social app') for more precise suggestions.
- 💡Specify your preferred icon library if you have one (e.g., 'suggest a Heroicons icon for settings') to narrow down results.
- 💡Review alternative suggestions critically; sometimes a less literal icon conveys the meaning more effectively or fits the overall design better.


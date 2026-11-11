# Meteor UI Storybook

Storybook is the visual reference for `@meteor/ui`. The component stories use game-platform examples, while component and API names stay aligned with the English exports in the package.

## Run Storybook

From the repository root:

```sh
bun dev:storybook
```

## Story map

| Storybook section | Coverage |
| --- | --- |
| `
/Design Tokens` | Semantic theme colors, typography, spacing, radii, action hierarchy, light/dark theme toggle |
| `Components/Button` | Button variants, sizes, content, links, and states |
| `Components/Display & Feedback` | Alert, AspectRatio, Avatar, Badge, Card, Item, Kbd, Progress, Prose, Separator, Skeleton, Spinner |
| `Components/Forms` | Checkbox, Input, Label, NativeSelect, RadioGroup, Slider, Switch, Textarea |
| `Components/Navigation` | Accordion, Breadcrumb, Collapsible, Pagination, Tabs |
| `Components/Overlays` | AlertDialog, ContextMenu, Dialog, Dropdown, HoverCard, Popover, Sheet, Tooltip |
| `Components/Controls & Forms/Advanced` | ButtonGroup, CheckboxGroup, ColorPicker, Combobox, Dropzone, Field, Form, InputGroup, InputOtp, Select, ThemeToggle, Toggle, ToggleGroup |
| `Components/Navigation & Data/Patterns` | Carousel, Image, NavigationMenu, ScrollArea, Sidebar, Table, Toaster, Video |
| `Layout/Patterns` | AutoGrid, CenteredLayout, Container, Grid, Inline, MasterDetailLayout, Panel, ResponsiveGrid, Section, Split, Stack, Surface, ThreeColumnLayout, Wrap |

Stories are currently organized around component families and common product patterns. Some compound families still need individual stories for every exported part and state; use the package barrel and family `index.ts` files as the source of truth when extending coverage.

## Adding a story

1. Import the exported component from `@meteor/ui` where possible.
2. Use the component's English API name in Storybook titles and section headings.
3. Include the default appearance plus relevant disabled, selected, invalid, loading, or empty states.
4. Use a Meteor product example and provide visible labels for interactive controls.
5. Add the story under the matching `Components`, `Foundations`, or `Layout` section.

The preview loads both `@meteor/ui/styles.css` and the platform theme tokens from `apps/platform/src/styles/tokens.css`.

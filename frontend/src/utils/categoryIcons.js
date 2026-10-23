import { CompassIcon, RulerIcon, BricksIcon, ToolsIcon, GridIcon } from '../components/Icons.jsx'

// Maps a category name coming from the API (Category.categoryName) to an
// icon component. Falls back to GridIcon for anything not listed here.
const map = {
  Cement: CompassIcon,
  'TMT Steel': RulerIcon,
  Sand: GridIcon,
  Aggregate: GridIcon,
  Bricks: BricksIcon,
  Blocks: BricksIcon,
  Plumbing: ToolsIcon,
  Electrical: ToolsIcon,
  Paints: ToolsIcon,
  Hardware: ToolsIcon,
}

export function iconForCategory(name) {
  return map[name] || GridIcon
}

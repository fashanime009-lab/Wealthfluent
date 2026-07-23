import { widgetMap } from "./widgetMap";

export default function WidgetRenderer({ widget }) {
  const Component = widgetMap[widget.component];

  if (!Component) {
    return null;
  }

  return <Component />;
}
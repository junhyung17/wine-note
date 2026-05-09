import { type WineColor, COLOR_LABELS, COLOR_HEX } from '../types/wine';

interface WineColorBadgeProps {
  color: WineColor;
  size?: 'sm' | 'md';
}

export default function WineColorBadge({ color, size = 'md' }: WineColorBadgeProps) {
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${padding}`}
      style={{ backgroundColor: COLOR_HEX[color] + '33', color: COLOR_HEX[color], border: `1px solid ${COLOR_HEX[color]}66` }}
    >
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: COLOR_HEX[color] }}
      />
      {COLOR_LABELS[color]}
    </span>
  );
}

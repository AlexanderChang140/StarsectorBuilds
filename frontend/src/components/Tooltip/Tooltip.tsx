import {
    Tooltip as AriaTooltip,
    type TooltipProps as AriaTooltipProps,
    TooltipTrigger as AriaTooltipTrigger,
    type TooltipTriggerComponentProps,
} from 'react-aria-components';

export interface TooltipProps extends Omit<AriaTooltipProps, 'children'> {
    children: React.ReactNode;
}

export function Tooltip({ children, ...props }: TooltipProps) {
    return (
        <AriaTooltip {...props}>
            {children}
        </AriaTooltip>
    );
}

export function TooltipTrigger(props: TooltipTriggerComponentProps) {
    return <AriaTooltipTrigger {...props} />;
}

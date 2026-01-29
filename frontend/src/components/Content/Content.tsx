import {
    Heading as AriaHeading,
    type HeadingProps,
    Text as AriaText,
    type TextProps,
} from 'react-aria-components';

export function Heading(props: HeadingProps) {
    return <AriaHeading {...props} />;
}

export function Text(props: TextProps) {
    return <AriaText {...props} />;
}

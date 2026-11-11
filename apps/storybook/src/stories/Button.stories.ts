
import { Button } from '@meteor/ui';

const meta = {
  title: 'Components/Button',
  component: Button,

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Базовая кнопка дизайн-системы Meteor. Поддерживает варианты оформления, размеры, disabled-состояние и рендеринг в виде ссылки.',
      },
    },
  },

  args: {
    variant: 'default',
    size: 'md',
    slots: {
      default: 'Button',
    },
  },

  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'primary',
        'secondary',
        'outline',
        'ghost',
        'info',
        'success',
        'warning',
        'error',
      ],
      description: 'Визуальный вариант кнопки',
    },

    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon-sm', 'icon', 'icon-lg'],
      description: 'Размер кнопки',
    },

    as: {
      control: 'radio',
      options: ['button', 'a'],
      description: 'HTML-элемент кнопки',
    },

    href: {
      control: 'text',
      description: 'Адрес ссылки, если as="a"',
    },

    disabled: {
      control: 'boolean',
    },

    focusableWhenDisabled: {
      control: 'boolean',
    },
  },
};

export default meta;

export const Playground = {
  name: 'Playground',
};

export const Default = {
  name: 'Default',
  args: {
    variant: 'default',
    slots: { default: 'Default button' },
  },
};

export const Primary = {
  name: 'Primary',
  args: {
    variant: 'primary',
    slots: { default: 'Primary action' },
  },
};

export const Secondary = {
  name: 'Secondary',
  args: {
    variant: 'secondary',
    slots: { default: 'Secondary action' },
  },
};

export const Outline = {
  name: 'Outline',
  args: {
    variant: 'outline',
    slots: { default: 'Outline button' },
  },
};

export const Ghost = {
  name: 'Ghost',
  args: {
    variant: 'ghost',
    slots: { default: 'Ghost button' },
  },
};

export const Info = {
  name: 'Info',
  args: {
    variant: 'info',
    slots: { default: 'Information' },
  },
};

export const Success = {
  name: 'Success',
  args: {
    variant: 'success',
    slots: { default: 'Success' },
  },
};

export const Warning = {
  name: 'Warning',
  args: {
    variant: 'warning',
    slots: { default: 'Warning' },
  },
};

export const Error = {
  name: 'Error',
  args: {
    variant: 'error',
    slots: { default: 'Error' },
  },
};

export const Small = {
  name: 'Small',
  args: {
    size: 'sm',
    slots: { default: 'Small button' },
  },
};

export const Medium = {
  name: 'Medium',
  args: {
    size: 'md',
    slots: { default: 'Medium button' },
  },
};

export const Large = {
  name: 'Large',
  args: {
    size: 'lg',
    slots: { default: 'Large button' },
  },
};

export const Disabled = {
  name: 'Disabled',
  args: {
    disabled: true,
    slots: { default: 'Disabled button' },
  },
};

export const DisabledFocusable = {
  name: 'Disabled but focusable',
  args: {
    disabled: true,
    focusableWhenDisabled: true,
    slots: { default: 'Focusable disabled button' },
  },
};

export const AsLink = {
  name: 'As link',
  args: {
    as: 'a',
    href: 'https://example.com',
    variant: 'primary',
    slots: { default: 'Open link' },
  },
};

export const LongLabel = {
  name: 'Long label',
  args: {
    variant: 'default',
    slots: {
      default: 'A button with a longer label to check its layout',
    },
  },
};

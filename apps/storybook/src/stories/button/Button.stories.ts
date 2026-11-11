import ButtonBasic from './ButtonBasic.astro';

export default {
  title: 'Components/Button',
  component: ButtonBasic,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Базовая кнопка дизайн-системы Meteor.',
      },
    },
  },
};

export const Basic = {};

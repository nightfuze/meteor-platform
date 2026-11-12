import "@meteor/ui/styles.css";
import "../../platform/src/styles/tokens.css";

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
      },
    },
  },
};

export default preview;

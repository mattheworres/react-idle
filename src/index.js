import {PureComponent} from 'react';
import PropTypes from 'prop-types';

const eventsChanged = (yeoldevents, yonnewevents) =>
  yeoldevents.sort().toString() !== yonnewevents.sort().toString();

export default class Idle extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {idle: this.props.defaultIdle};
    this.timeout = null;
  }

  componentDidMount() {
    this.attachEvents();
    this.setTimeout();
  }

  componentDidUpdate(prevProps) {
    if (eventsChanged(prevProps.events, this.props.events)) {
      this.removeEvents();
      this.attachEvents();
    }
  }

  componentWillUnmount() {
    this.removeEvents();
  }

  attachEvents() {
    this.props.events.forEach(event => {
      window.addEventListener(event, this.handleEvent, true);
    });
  }

  removeEvents() {
    this.props.events.forEach(event => {
      window.removeEventListener(event, this.handleEvent, true);
    });
  }

  handleChange(idle) {
    this.props.onChange({idle});
    this.setState({idle});
  }

  handleEvent() {
    if (this.state.idle) {
      this.handleChange(false);
    }

    clearTimeout(this.timeout);
    this.setTimeout();
  }

  setTimeout() {
    this.timeout = setTimeout(() => {
      this.handleChange(true);
    }, this.props.timeout);
  }

  render() {
    return this.props.render(this.state);
  }
}

Idle.propTypes = {
  defaultIdle: PropTypes.bool,
  render: PropTypes.func,
  onChange: PropTypes.func,
  timeout: PropTypes.number,
  events: PropTypes.array,
};

Idle.defaultProps = {
  defaultIdle: false,
  render: () => null,
  onChange: () => {},
  timeout: 1000,
  events: ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'],
};

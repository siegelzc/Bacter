class Text extends React.Component { // Each input-type component renders a table row containing the input type
    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            focused: false, // If the user is focused on the field
            backgroundColor: 'rgb(255, 255, 255)' // Initialize backgroundColor style in state so it can be edited and re-rendered with React
        };
        this.style = {};
        this.menuType = props.menuType;
        this.instance = props.instance;
        // this.index = menus[this.menuType].options.indexOf(Z.capitalize(this.instance)); // Not currently in use

        this.applyInstance = this.applyInstance.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    applyInstance() {
        // noinspection JSRedundantSwitchStatement
        switch (this.instance) {
            case 'password':
                if (this.menuType === 'join' || this.menuType === 'spectate') { // Caution: password instance exists in create and join/spectate menus
                    connection.emit('ask permission', { pass: this.state.value, info: Game.game.info }); // Add player to permissed list on server (if there is no password for game)
                }
                break;
        }
    }

    // Event Handlers
    handleFocus(event) {
        if (event.type === 'focus') {
            this.setState({ focused: true, backgroundColor: 'rgb(230, 230, 230)' });
        } else if (event.type === 'blur') {
            this.setState({ focused: false, backgroundColor: 'rgb(255, 255, 255)' });
        }
    }

    handleChange(event) { // event.target is dom element of target
        this.props.update(this.instance, event.target.value);
        if (this.instance === 'password' && (this.menuType === 'join' || this.menuType === 'spectate')) {
            connection.emit('ask permission', { pass: event.target.value, info: Game.game.info }); // Add player to permissed list on server (if correct password)
        }
    }

    handleKeyDown(event) {
        if (event.keyCode === 13) // If ENTER key is down
            this.props.submit(this.menuType);
    }

    // React Lifecycle Hooks
    componentDidMount() {
        this.applyInstance();
        this.props.update(this.instance, this.state.value);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.value !== prevState.value) {
            return { value: nextProps.value }; // Return value is applied to new state
        }
        return null;
    }

    // componentWillReceiveProps(next) { // Deprecated by React
    //    this.setState({ value: next.value });
    // }

    render() {
        let style = {};
        for (let i in this.style) {
            style[i] = this.style[i];
        }
        style.backgroundColor = this.state.backgroundColor;

        return (
            <input
                id={this.instance + ' input'}
                className='menuinput'
                type='text'
                value={this.state.value}
                autoComplete='off'
                style={style}
                onFocus={this.handleFocus}
                onBlur={this.handleFocus}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
            ></input>
        );
    }
}

import './loginForm.scss';

import React, { ChangeEvent, Component } from 'react';
import { Form, Grid, InputOnChangeData } from 'semantic-ui-react';

import { httpPost } from '../services/apiservice';
import * as storage from '../utils/storage';

type LoginProps = {
  onLoginSuccess: Function;
};

export type LoginState = {
  user: string;
  password: string;
  message: string;
};

class LoginForm extends Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);

    this.state = {
      user: '',
      password: '',
      message: ''
    };
  }
  handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => {
    this.setState({
      [data.name]: data.value
    } as Pick<LoginState, keyof LoginState>);
  };

  handleSubmit = async (event: any) => {
    event.preventDefault();
    const { user, password } = this.state;
    try {
      const { data } = await httpPost(
        '/login',
        { user: user, password: password },
        {}
      );
      const { token_id } = data;

      storage.set('token_id', token_id);
      storage.set('user', user);
      this.props.onLoginSuccess();
    } catch (e) {
      if (!e || !e.response) {
        return this.setState({ message: 'Could not connect to server' });
      }
      this.setState({ message: e.response.data });
    }
  };

  render() {
    const { user, message } = this.state;

    return (
      <div className="login-form main">
        <Grid verticalAlign="middle" columns={1} centered>
          <Grid.Column textAlign="center">
            <img
              className="logo"
              alt="eidos"
              src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjU2IDQ4IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyNTYgNDg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48c3R5bGUgdHlwZT0idGV4dC9jc3MiPi5zdDB7ZmlsbDojNDU0QjYwO308L3N0eWxlPjxnPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xNzkuNTgsMjEuMTh2MTcuMDhoLTEuNzh2LTMuMTRjLTEuODgsMi40OS00LjU1LDMuNDMtOC4wMiwzLjQzYy01LjAyLDAtOC4zNS0yLjItOC4zNS02LjM4VjI3LjJsMTYuMzgtMi42M3YtMy4zOGMwLTMuNzUtMi4zLTUuNTgtNi40OC01LjU4Yy0zLjU3LDAtNi44LDEuMzYtOC4yMSwyLjExbC0wLjc1LTEuNTVjMS42OS0wLjk0LDUuNDktMi4zLDguOTYtMi4zQzE3Ni4zOSwxMy44NiwxNzkuNTgsMTYuNTMsMTc5LjU4LDIxLjE4eiBNMTc3Ljg1LDI2LjI1bC0xNC42OSwyLjM1djMuNTdjMCwzLjI0LDIuNjcsNC42OSw2LjcxLDQuNjljMy45NCwwLDcuOTgtMi4wMiw3Ljk4LTUuMzVWMjYuMjV6Ii8+PHBhdGggY2xhc3M9InN0MCIgZD0iTTE4NC42MSw1Ljg4aDEuNzR2MzIuMzhoLTEuNzRWNS44OHoiLz48cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTkzLjA1LDQ3LjY0aC0xLjc0VjE0LjMzaDEuNzR2My40N2MxLjc4LTIuODIsNS4xMi0zLjk0LDguMzUtMy45NGM1LjU0LDAsOS4zOCwzLjI0LDkuMzgsOC41OXY3Ljg0YzAsNS4yNi0zLjg5LDguNDUtOS4zOCw4LjQ1Yy0zLjI0LDAtNi42Mi0xLjA4LTguMzUtMy42NlY0Ny42NHogTTE5My4wMSwzMC44NGMwLDQuMjIsNC4wMyw2LjE1LDguNCw2LjE1YzQuNDEsMCw3LjY1LTIuNTMsNy42NS02Ljcxdi03Ljg0YzAtNC4zMi0zLjE0LTYuODUtNy42NS02Ljg1Yy00LjI3LDAtOC40LDIuMTEtOC40LDYuMjlWMzAuODR6Ii8+PHBhdGggY2xhc3M9InN0MCIgZD0iTTIzMy45MywyMS45OHYxNi4yOGgtMS43NFYyMS45OGMwLTQuMDQtMi42My02LjM4LTYuOC02LjM4Yy00LjQ2LDAtOS4yOSwzLjMzLTkuMjksNy4zN3YxNS4zaC0xLjc0VjUuODhoMS43NHYxMy4xNGMxLjk3LTMuMTksNS4xNi01LjE2LDkuMjktNS4xNkMyMzAuNiwxMy44NiwyMzMuOTMsMTYuOTEsMjMzLjkzLDIxLjk4eiIvPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yNTUsMjEuMTh2MTcuMDhoLTEuNzh2LTMuMTRjLTEuODgsMi40OS00LjU1LDMuNDMtOC4wMiwzLjQzYy01LjAyLDAtOC4zNS0yLjItOC4zNS02LjM4VjI3LjJsMTYuMzgtMi42M3YtMy4zOGMwLTMuNzUtMi4zLTUuNTgtNi40Ny01LjU4Yy0zLjU3LDAtNi44LDEuMzYtOC4yMSwyLjExbC0wLjc1LTEuNTVjMS42OS0wLjk0LDUuNDktMi4zLDguOTYtMi4zQzI1MS44MSwxMy44NiwyNTUsMTYuNTMsMjU1LDIxLjE4eiBNMjUzLjI2LDI2LjI1bC0xNC42OSwyLjM1djMuNTdjMCwzLjI0LDIuNjcsNC42OSw2LjcxLDQuNjljMy45NCwwLDcuOTgtMi4wMiw3Ljk4LTUuMzVWMjYuMjV6Ii8+PC9nPjxnPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik03Ni4zOCwzMy41MmwxLjMxLDIuNThjLTIuMzksMS43OC01LjU0LDIuNDQtOC44NywyLjQ0Yy01LjQ0LDAtMTAuNy0yLjc3LTEwLjctOC4yNnYtOC40YzAtNC42NSw0LjkzLTcuOTgsMTAuMTgtNy45OGM1LjM1LDAsOS44NSwzLjI4LDkuODUsNy45OHY1LjAySDYxLjgzdjMuMjRjMCwzLjUyLDMuNDIsNS4yMSw3LjE4LDUuMjFDNzIuMjUsMzUuMzUsNzQuODMsMzQuNTUsNzYuMzgsMzMuNTJ6IE02MS44MywyMS45M3YyLjE2aDEyLjc2di0yLjE2YzAtMi44Ni0yLjkxLTQuODgtNi4yOS00Ljg4QzY0Ljk3LDE3LjA1LDYxLjg4LDE5LjExLDYxLjgzLDIxLjkzeiIvPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik04MS4xNiwxNC4zM2gzLjc1djIzLjkzaC0zLjc1VjE0LjMzeiIvPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMDUuMTksNS44OGgzLjcxdjMyLjM4aC0zLjI5bC0wLjQyLTMuMTRjLTEuNjQsMi41My00Ljc0LDMuNTctNy43LDMuNTdjLTUuNzIsMC05LjI5LTMuMTktOS4yOS04LjYzdi03LjU1YzAtNS4zNSwzLjYxLTguNjMsOS4yOS04LjYzYzMsMCw2LjAxLDEuMDgsNy43LDMuNDdWNS44OHogTTEwNS4xOSwyMi4xNmMwLTMuNTItMy4yOC01LjExLTYuOTUtNS4xMWMtMy42MSwwLTYuMzMsMi4wNi02LjMzLDUuNDR2Ny41NWMwLDMuNjEsMi42Myw1LjQ5LDYuNDMsNS40OWMzLjUyLDAsNi44NS0xLjY0LDYuODUtNS4wN1YyMi4xNnoiLz48cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTMyLjAzLDIyLjI2djcuOThjMCw1LjIxLTQuOTMsOC40LTEwLjMyLDguNGMtNS40OSwwLTEwLjQyLTMuMTktMTAuNDItOC40di03Ljk4YzAtNS4xNiw0Ljc5LTguMzUsMTAuNDItOC4zNUMxMjcuNDQsMTMuOSwxMzIuMDMsMTcuMTQsMTMyLjAzLDIyLjI2eiBNMTI4LjI4LDIyLjQ1YzAtMy4yOS0zLjE5LTUuMjEtNi41Ny01LjIxUzExNSwxOS4yMSwxMTUsMjIuNDV2Ny42YzAsMy4zMywzLjI0LDUuMyw2LjcxLDUuM2MzLjMzLDAsNi41Ny0xLjk3LDYuNTctNS4zVjIyLjQ1eiIvPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xNTEuNiwzMS44M2MwLDQuNzQtNC4wNCw2LjktOC45Miw2LjljLTMuMSwwLTYuOTktMC45OS05LjYyLTMuMWwxLjU1LTIuNjNjMS45NywxLjY0LDUuMywyLjU4LDcuODQsMi41OGMzLjQyLDAsNS41OC0xLjA4LDUuNTgtMy42NmMwLTIuMTEtMS42LTMuMTQtNi4wNS00LjE4Yy01Ljg2LTEuMjctOC4wMi0zLjQzLTguMDItNy4wNGMwLTQuODgsNC4xOC02LjgsOC43My02LjhjMy4xLDAsNi4yNCwwLjg0LDguNTQsMi4yNWwtMS40MSwyLjY3Yy0xLjkyLTEuMDMtNC4wNC0xLjc4LTYuNzYtMS43OGMtMy4wNSwwLTUuNDksMC44OS01LjQ5LDMuNzFjMCwyLjE2LDEuNTUsMy4xOSw1Ljk2LDQuMDhDMTQ5LjQ5LDI2LjExLDE1MS41NiwyOC4yNiwxNTEuNiwzMS44M3oiLz48L2c+PGc+PHBvbHlnb24gY2xhc3M9InN0MCIgcG9pbnRzPSI4MC45OCw4LjIxIDg1LjAxLDEwLjU0IDg1LjAxLDUuODggIi8+PC9nPjwvZz48Zz48cGF0aCBjbGFzcz0ic3QwIiBkPSJNMzkuNzMsMi42OEwyNy4zNywyNC4wOUwzOS43Myw0NS41YzAuNDgtMC4zLDAuOTQtMC42MiwxLjQtMC45NVYzLjYzQzQwLjY3LDMuMyw0MC4yMSwyLjk4LDM5LjczLDIuNjh6Ii8+PHBhdGggY2xhc3M9InN0MCIgZD0iTTM4LjA0LDQ2LjQ5TDI1LjY4LDI1LjA3SDAuOTZjMC4wMiwwLjU2LDAuMDMsMS4xMiwwLjA5LDEuNjdsMzUuNDgsMjAuNDhDMzcuMDQsNDYuOTksMzcuNTUsNDYuNzUsMzguMDQsNDYuNDl6Ii8+PHBhdGggY2xhc3M9InN0MCIgZD0iTTAuOTYsMjMuMTFoMjQuNzFMMzguMDQsMS42OWMtMC40OS0wLjI2LTEtMC41LTEuNTItMC43M0wxLjA1LDIxLjQ0QzEsMjEuOTksMC45OCwyMi41NSwwLjk2LDIzLjExeiIvPjwvZz48L2c+PC9zdmc+"
            />
            <Form onSubmit={this.handleSubmit} size="small">
              <Form.Input
                fluid
                iconPosition="left"
                placeholder="Username"
                type="text"
                name="user"
                value={user}
                onChange={this.handleChange}
                id="username"
              />
              <Form.Input
                fluid
                iconPosition="left"
                placeholder="Password"
                type="password"
                name="password"
                onChange={this.handleChange}
                id="password"
              />
              {message ? (
                <div className="ui small red message">{message}</div>
              ) : (
                ''
              )}
              <Form.Button primary content="Sign In" id="submit" />
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default LoginForm;

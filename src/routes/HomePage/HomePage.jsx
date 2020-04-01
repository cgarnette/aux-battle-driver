import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility,
} from 'semantic-ui-react'

import logo from '../../backgrounds/logo.png';
import logoW from '../../backgrounds/logo_white.png';
import appIcon from '../../backgrounds/app_icon.png';

// Heads up!
// We using React Static to prerender our docs with server side rendering, this is a quite simple solution.
// For more advanced usage please check Responsive docs under the "Usage" section.
const getWidth = () => {
  const isSSR = typeof window === 'undefined'

  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */
const HomepageHeading = ({ mobile }) => (
  <Container text>
    <Image src={logoW} style={{height: '15em', width: '80em'}}/>
    <Header
      as='h2'
      content='For All the Music To Set It Off Right'
      inverted
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
        marginTop: mobile ? '0.5em' : '1.5em',
      }}
    />
  </Container>
)

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
}

/* Heads up!
 * Neither Semantic UI nor Semantic UI React offer a responsive navbar, however, it can be implemented easily.
 * It can be more complicated, but you can create really flexible markup.
 */
class DesktopContainer extends Component {
  state = {}

  hideFixedMenu = () => this.setState({ fixed: false })
  showFixedMenu = () => this.setState({ fixed: true })

  render() {
    const { children } = this.props
    const { fixed } = this.state

    return (
      <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment
            inverted
            textAlign='center'
            style={{ minHeight: 500, padding: '1em 0em', backgroundImage: "linear-gradient(to bottom right, #E7717D, purple)"
          }}
            vertical
          >
            <Menu
              fixed={fixed ? 'top' : null}
              inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size='large'
            >
              <Container>
                <Menu.Item as='a' href="/" active>
                  Home
                </Menu.Item>
                <Menu.Item as='a' >How To Play</Menu.Item>
                <Menu.Item as='a' href="/game">Aux Battle</Menu.Item>
                <Menu.Item as='a' href="/party">Party Room</Menu.Item>
                <Menu.Item as='a' href="/join">Join a Room</Menu.Item>
              </Container>
            </Menu>
            <HomepageHeading />
          </Segment>
        </Visibility>

        {children}
      </Responsive>
    )
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
}

class MobileContainer extends Component {
  state = {}

  handleSidebarHide = () => this.setState({ sidebarOpened: false })

  handleToggle = () => this.setState({ sidebarOpened: true })

  render() {
    const { children } = this.props
    const { sidebarOpened } = this.state

    return (
      <Responsive
        as={Sidebar.Pushable}
        getWidth={getWidth}
        maxWidth={Responsive.onlyMobile.maxWidth}
      >
        <Sidebar
          as={Menu}
          animation='push'
          inverted
          onHide={this.handleSidebarHide}
          vertical
          visible={sidebarOpened}
        >
          <Menu.Item as='a' href="/" active>
            Home
          </Menu.Item>
          <Menu.Item as='a' >How To Play</Menu.Item>
          <Menu.Item as='a' href="/game">Aux Battle</Menu.Item>
          <Menu.Item as='a' href="/party">Party Room</Menu.Item>
          <Menu.Item as='a' href="/join">Join a Room</Menu.Item>
        </Sidebar>

        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Segment
            inverted
            textAlign='center'
            style={{ minHeight: 350, padding: '1em 0em', backgroundImage: "linear-gradient(to bottom right, #E7717D, purple)" }}
            vertical
          >
            <HomepageHeading mobile />
          </Segment>

          {children}
        </Sidebar.Pusher>
      </Responsive>
    )
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
}

const ResponsiveContainer = ({ children }) => (
  <div>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </div>
)

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
}

const HomePage = () => (
  <ResponsiveContainer>
    <Segment style={{ padding: '8em 0em' }} vertical>
      <Grid container stackable verticalAlign='middle'>
        <Grid.Row>
          <Grid.Column width={8}>
            <Header as='h3' style={{ fontSize: '2em' }}>
              Challenge the crowds taste in Aux Battle
            </Header>
            <p style={{ fontSize: '1.33em' }}>
              Who has the magic touch to set any party off just right? Find out by
              going head-to-head in this showdown of rhythmic intuition. Win the crowd over
              by playing to their taste.
            </p>
            <Header as='h3' style={{ fontSize: '2em' }}>
              More than two competitors? No Problem
            </Header>
            <p style={{ fontSize: '1.33em' }}>
              Start a Free For All Aux Battle where the whole room can try their hand for the title of champion,
              and rights to control the Aux.
            </p>
          </Grid.Column>
          <Grid.Column floated='right' width={6}>
            <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'row'}}>
              <Image bordered rounded size='large' src={appIcon} style={{border: 'none', height: '10em', width: '10em'}}/>
            </div>
            
            <div style={{display: 'flex', marginTop: '3em', justifyContent:'center', flexDirection: 'row'}}>
              <h2>Coming Soon To the App Store</h2>
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={7} style={{display: 'flex', alignItems: 'center'}}>
            <Button style={{marginTop: '2em'}} size='huge' as="a" href="/game">Start a Game</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
    <Segment style={{ padding: '0em' }} vertical>
      <Grid celled='internally' columns='equal' stackable>
        <Grid.Row textAlign='center'>
          <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
            <Header as='h3' style={{ fontSize: '2em' }}>
              "All's fair in love and the Aux Battle"
            </Header>
            <p style={{ fontSize: '1.33em' }}>- That is what they all say about us</p>
          </Grid.Column>
          <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
            <Header as='h3' style={{ fontSize: '2em' }}>
              "Party Rooms are perfect for kickbacks"
            </Header>
            <p style={{ fontSize: '1.33em' }}>
              - <b>Everyone who's ever tried it</b>
            </p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
    <Segment style={{ padding: '8em 0em' }} vertical>
      <Container text>
        <Header as='h3' style={{ fontSize: '2em' }}>
          Start a party where anybody can be the DJ!
        </Header>
        <p style={{ fontSize: '1.33em' }}>
          Open up a party room and start your event off just right. No need
          for just one person to hold the Aux, anybody can hop on and queue up
          their favorites!
        </p>
        <Button as='a' size='large' href="/party">
          Open a Party Room
        </Button>
        <Divider
          as='h4'
          className='header'
          horizontal
          style={{ margin: '3em 0em', textTransform: 'uppercase' }}
        >
        </Divider>
        <Header as='h3' style={{ fontSize: '2em' }}>
          Looking to Enter a Room?
        </Header>
        <p style={{ fontSize: '1.33em' }}>
          No problem! Simply enter in the room number and you'll be taken right
          where you belong!
        </p>
        <Button as='a' size='large' href="/join">
          Enter a Room
        </Button>
      </Container>
    </Segment>
    <Segment inverted vertical style={{ padding: '5em 0em' }}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='About' />
              <List link inverted>
                <List.Item as='a'>About Us</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={7}>
              <Header as='h4' inverted>
                Footer Header
              </Header>
              <p>
                Extra space for a call to action inside the footer that could help re-engage users.
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
  </ResponsiveContainer>
)
export default HomePage
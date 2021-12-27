import React from 'react';
import { Col, Row } from '@douyinfe/semi-ui';
import { Link } from 'react-router-dom'
import { Typography } from '@douyinfe/semi-ui';
import { IconGithubLogo, IconMoon, IconSun } from '@douyinfe/semi-icons';
import './blogNav.css'

export default class NavApp extends React.Component {
    click = (e) => {
        this.props.changeShowMode()
    }


    render() {
        const { Text, Title } = Typography;
        return (
            <div style={{ width: '100%', height: 'auto', background: 'rgba(var(--semi-grey-0), 1)', border: '1px solid rgba(var(--semi-grey-1), 1)', marginBottom: '10px'}}>
                <Row gutter={{xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24}}>
                    <Col xs={3} sm={7} md={7} lg={7} xl={7} xxl={7} className='h100'>
                    </Col>
                    <Col xs={18} sm={10} md={10} lg={10} xl={10} xxl={10} className='flex h100' style={{padding: '0 0 2px 0'}}>
                        <Link to='' className='miss-ul udl'><Title heading={4}>Frazier Yang</Title></Link>
                        <div className='flex h100' style={{width: '20%'}}>
                            <Link to='blog' className='miss-ul udl' style={{padding: '0 0 2px 0'}}><Text strong={true}>Blog</Text></Link>
                            <a href='https://www.github.com/ayang818' className='udl' style={{padding: '3px 0 0 0'}} target='blank'><IconGithubLogo style={{color: 'rgba(var(--semi-grey-8), 1)'}}/></a>
                            {/* 开关 */}
                            <div onClick={this.click} className='udl' style={{padding: '3px 0 0 0'}}>{
                            this.props.isLight ? <IconSun style={{color: 'rgba(var(--semi-orange-2), 1)'}}/> : <IconMoon style={{color: 'rgba(var(--semi-light-blue-8), 1)'}}/>
                            }
                            </div>
                        </div>
                    </Col>
                    <Col xs={3} sm={7} md={7} lg={7} xl={7} xxl={7} className='h100'>
                    </Col>
                </Row>
            </div>
        );
    }
}

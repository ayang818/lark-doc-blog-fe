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
                <Row>
                    <Col span={7} className='h100'></Col>
                    <Col span={10} className='flex h100' style={{padding: '0 0 2px 0'}}>
                        <Link to='/' className='miss-ul udl'><Title heading={4}>Jeffery Yang</Title></Link>
                        <div className='flex' style={{width: '20%'}}>
                            <Link to='blog' className='miss-ul udl'><Text strong={true}>Blog</Text></Link>
                            <a href='https://www.github.com/ayang818' className='udl' style={{padding: '3px 0 0 0'}} target='blank'><IconGithubLogo style={{color: 'rgba(var(--semi-grey-8), 1)'}}/></a>
                            {/* 开关 */}
                            <div></div>
                        </div>
                    </Col>
                    <Col span={7} className='flex h100' >
                    <div onClick={this.click} className='udl'>{
                        this.props.isLight ? <IconSun style={{color: 'rgba(var(--semi-orange-2), 1)'}}/> : <IconMoon style={{color: 'rgba(var(--semi-light-blue-8), 1)'}}/>
                    }
                    </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

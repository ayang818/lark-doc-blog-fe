import React from 'react';
import { Nav, Avatar, Dropdown } from '@douyinfe/semi-ui';
import { IconStar, IconUser, IconUserGroup, IconSetting, IconEdit } from '@douyinfe/semi-icons';

export default class NavApp extends React.Component {
    click = (key) => {
        if (key.itemKey === 'switch') {
            const body = document.body;
            if (body.hasAttribute('theme-mode')) {
                body.removeAttribute('theme-mode');
            } else {
                body.setAttribute('theme-mode', 'dark');
            }
        }
    }
    render() {
        return (
            <div style={{ width: '100%' }}>
                <Nav
                    mode={'horizontal'}
                    items={[
                        { itemKey: 'blog', text: '博客', icon: <IconUser /> },
                        { itemKey: 'switch', text: '切换主题', icon: <IconStar /> },
                    ]}
                    onClick={this.click}
                    footer={
                        <Dropdown
                            position="bottomRight"
                            render={
                                <Dropdown.Menu>
                                    <Dropdown.Item>详情</Dropdown.Item>
                                    <Dropdown.Item>退出</Dropdown.Item>
                                </Dropdown.Menu>
                            }
                        >
                            <Avatar size="small" color='light-blue' style={{margin: 4}}>BD</Avatar>
                            <span>Bytedancer</span>
                        </Dropdown>
                    }
                />
            </div>
        );
    }
}

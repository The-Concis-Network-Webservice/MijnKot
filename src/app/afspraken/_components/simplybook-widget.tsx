'use client';

import { useEffect } from 'react';

const CONTAINER_ID = 'sbw_guh4eq';

export function SimplybookWidget() {
    useEffect(() => {
        // Avoid double-init on hot reload
        if (document.getElementById('sbw-script')) return;

        const script = document.createElement('script');
        script.id = 'sbw-script';
        script.src = '//widget.simplybook.it/v2/widget/widget.js';
        script.async = true;
        script.onload = () => {
            // @ts-ignore
            new window.SimplybookWidget({
                widget_type: 'iframe',
                url: 'https://mijnkotbe.simplybook.it',
                theme: 'space',
                theme_settings: {
                    timeline_hide_unavailable: '1',
                    sb_base_color: '#4d5935',
                    hide_past_days: '0',
                    timeline_show_end_time: '0',
                    timeline_modern_display: 'as_slots',
                    display_item_mode: 'block',
                    body_bg_color: '#fdfcfb',
                    sb_review_image: '',
                    dark_font_color: '#434341',
                    light_font_color: '#ffffff',
                    btn_color_1: '#ca4b1c',
                    sb_company_label_color: '#4d5935',
                    hide_img_mode: '1',
                    show_sidebar: '0',
                    sb_busy: '#c7b3b3',
                    sb_available: '#4d5935',
                    hide_name: '1',
                    hide_description: '1',
                    hide_header: '1',
                    hide_header_user_login: '1',
                },
                timeline: 'modern',
                datepicker: 'top_calendar',
                is_rtl: false,
                app_config: { clear_session: 0, allow_switch_to_ada: 0, predefined: [] },
                container_id: CONTAINER_ID,
            });
        };
        document.head.appendChild(script);
    }, []);

    return (
        <div className="w-full overflow-hidden" style={{ height: '850px' }}>
            <div 
                id={CONTAINER_ID} 
                className="w-full" 
                style={{ 
                    marginTop: '-150px', // Cropping the header
                    minHeight: '1000px' 
                }} 
            />
        </div>
    );
}

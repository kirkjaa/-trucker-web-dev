# Missing Assets - Manual Export Required

The following 31 assets failed to download because the Figma asset URLs expired (they expire after 7 days). These need to be manually exported from Figma.

## How to Export from Figma

1. Open your Figma file: `uKoCerq5o10oACndFqsyPw`
2. Find each asset in the design
3. Select the asset
4. In the right panel, click "Export"
5. Choose the appropriate format (SVG for icons, PNG for images)
6. Save to the path specified below
7. Update the constant in `src/App.tsx` to use the local path

## Images (3)

- `public/assets/images/city.png` - CITY_IMAGE
- `public/assets/images/truck.png` - TRUCK_IMAGE  
- `public/assets/images/map-pin.png` - MAP_PIN_IMAGE

## Icons - Home Shortcuts (11)

- `public/assets/icons/current-jobs.svg` - HOME_SHORTCUT_CURRENT_ICON
- `public/assets/icons/bid.svg` - HOME_SHORTCUT_BID_ICON
- `public/assets/icons/revenue.svg` - HOME_SHORTCUT_REVENUE_ICON
- `public/assets/icons/history.svg` - HOME_SHORTCUT_HISTORY_ICON
- `public/assets/icons/search.svg` - HOME_SEARCH_ICON
- `public/assets/icons/clock.svg` - HOME_CLOCK_ICON
- `public/assets/icons/route-start.svg` - HOME_ROUTE_START_ICON
- `public/assets/icons/route-stops.svg` - HOME_ROUTE_STOPS_ICON
- `public/assets/icons/route-dest.svg` - HOME_ROUTE_DEST_ICON
- `public/assets/icons/price.svg` - HOME_PRICE_ICON
- `public/assets/icons/nav-home.svg` - HOME_NAV_HOME_ICON

## Icons - Navigation (2)

- `public/assets/icons/nav-chat.svg` - HOME_NAV_CHAT_ICON
- `public/assets/icons/nav-settings.svg` - HOME_NAV_SETTINGS_ICON

## Icons - Current Jobs (5)

- `public/assets/icons/back.svg` - CURRENT_JOBS_BACK_ICON
- `public/assets/icons/search-icon.svg` - CURRENT_JOBS_SEARCH_ICON
- `public/assets/icons/filter.svg` - CURRENT_JOBS_FILTER_ICON
- `public/assets/icons/clock-icon.svg` - CURRENT_JOBS_CLOCK_ICON
- `public/assets/icons/price-icon.svg` - CURRENT_JOBS_PRICE_ICON

## Icons - Terms & Policy (8)

- `public/assets/icons/terms-close.svg` - TERMS_CLOSE_ICON
- `public/assets/icons/terms-signal.svg` - TERMS_SIGNAL_ICON
- `public/assets/icons/terms-wifi.svg` - TERMS_WIFI_ICON
- `public/assets/icons/terms-battery.svg` - TERMS_BATTERY_ICON
- `public/assets/icons/policy-signal.svg` - POLICY_SIGNAL_ICON
- `public/assets/icons/policy-wifi.svg` - POLICY_WIFI_ICON
- `public/assets/icons/policy-battery.svg` - POLICY_BATTERY_ICON
- `public/assets/icons/policy-close.svg` - POLICY_CLOSE_ICON

## Icons - Settings (1)

- `public/assets/icons/settings-status-wifi.svg` - SETTINGS_STATUS_WIFI

## After Exporting

1. Update each constant in `src/App.tsx` from:
   ```typescript
   const CHECK_ICON = 'https://www.figma.com/api/mcp/asset/...'
   ```
   to:
   ```typescript
   const CHECK_ICON = '/assets/icons/check.svg'
   ```

2. Remove the TODO comments once all assets are exported












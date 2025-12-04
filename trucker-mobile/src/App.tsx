import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, ClipboardEvent, CSSProperties, FormEvent, KeyboardEvent, UIEvent } from 'react'
import { useTranslation } from 'react-i18next'
import './App.css'
import { api, setAuthToken, getAuthToken } from './api'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { useHomeData, useDashboardData } from './hooks/useHomeData'
import Chat from './components/chat/ChatNew'
import PrivateChat from './components/chat/PrivateChat'
import GroupChat from './components/chat/GroupChat'
import ChatSubMenu from './components/chat/ChatSubMenu'
import DeleteConversationDialog from './components/chat/DeleteConversationDialog'
import FilesAndVideos from './components/chat/FilesAndVideos'
import MemberList from './components/chat/MemberList'
import AddMember from './components/chat/AddMember'
import { PartialDeliveryPage } from './components/PartialDeliveryPage'
import { ReportIssueModal } from './components/ReportIssueModal'
import { RevenueScreen } from './components/RevenueScreen'

// Images - downloaded and saved locally
const CITY_IMAGE = '/assets/images/city.png'
const TRUCK_IMAGE = '/assets/images/truck.png'

// Shipping Home illustrations - from Figma design
const HERO_TRUCK_ILLUSTRATION = '/assets/shipping/hero-truck.png'
const CARD_FINANCE_ILLUSTRATION = '/assets/shipping/card-finance.png'
const CARD_BIDDING_ILLUSTRATION = '/assets/shipping/card-bidding.png'
const CARD_SHIPPING_ILLUSTRATION = '/assets/shipping/card-shipping.png'
const CARD_CUSTOMER_ILLUSTRATION = '/assets/shipping/card-customer.png'
const CARD_PRODUCT_ILLUSTRATION = '/assets/shipping/card-product.png'
const CARD_VEHICLE_ILLUSTRATION = '/assets/shipping/card-vehicle.png'
const MAP_PIN_IMAGE = '/assets/images/map-pin.png'
const CHECK_ICON = '/assets/icons/check.svg'

// Terms & Policy icons - downloaded and saved locally (Terms icons are copies of Policy icons)
const TERMS_CLOSE_ICON = '/assets/icons/terms-close.svg'
const TERMS_SIGNAL_ICON = '/assets/icons/terms-signal.svg'
const TERMS_WIFI_ICON = '/assets/icons/terms-wifi.svg'
const TERMS_BATTERY_ICON = '/assets/icons/terms-battery.svg'

const POLICY_SIGNAL_ICON = '/assets/icons/policy-signal.svg'
const POLICY_WIFI_ICON = '/assets/icons/policy-wifi.svg'
const POLICY_BATTERY_ICON = '/assets/icons/policy-battery.svg'
const POLICY_CLOSE_ICON = '/assets/icons/policy-close.svg'

// Home icons - downloaded and saved locally
const HOME_SHORTCUT_CURRENT_ICON = '/assets/icons/current-jobs.svg'
const HOME_SHORTCUT_BID_ICON = '/assets/icons/bid.svg'
const HOME_SHORTCUT_REVENUE_ICON = '/assets/icons/revenue.svg'
const HOME_SHORTCUT_HISTORY_ICON = '/assets/icons/history.svg'
const HOME_SEARCH_ICON = '/assets/icons/search.svg'
const HOME_CLOCK_ICON = '/assets/icons/clock.svg'
const HOME_ROUTE_START_ICON = '/assets/icons/route-start.svg'
const HOME_ROUTE_STOPS_ICON = '/assets/icons/route-stops.svg'
const HOME_ROUTE_DEST_ICON = '/assets/icons/route-dest.svg'
const HOME_PRICE_ICON = '/assets/icons/price.svg'
const HOME_NAV_HOME_ICON = '/assets/icons/nav-home.svg'
const HOME_NAV_CONTROL_ICON =
  "data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 4.5V19.5' stroke='%235A6472' stroke-width='1.6' stroke-linecap='round'/%3E%3Cpath d='M12 4.5V19.5' stroke='%235A6472' stroke-width='1.6' stroke-linecap='round'/%3E%3Cpath d='M17 4.5V19.5' stroke='%235A6472' stroke-width='1.6' stroke-linecap='round'/%3E%3Ccircle cx='7' cy='9.5' r='2' fill='%23EEF2F7' stroke='%235A6472' stroke-width='1.2'/%3E%3Ccircle cx='12' cy='14.5' r='2' fill='%23EEF2F7' stroke='%235A6472' stroke-width='1.2'/%3E%3Ccircle cx='17' cy='8.5' r='2' fill='%23EEF2F7' stroke='%235A6472' stroke-width='1.2'/%3E%3C/svg%3E"
const HOME_NAV_CHAT_ICON = '/assets/icons/nav-chat.svg'
const HOME_NAV_SETTINGS_ICON = '/assets/icons/nav-settings.svg'
const HOME_NAV_SHIPPING_ICON = '/assets/icons/nav-shipping.svg'
// Current Jobs icons - downloaded and saved locally
const CURRENT_JOBS_BACK_ICON = '/assets/icons/back.svg'
const CURRENT_JOBS_SEARCH_ICON = '/assets/icons/search-icon.svg'
const CURRENT_JOBS_FILTER_ICON = '/assets/icons/filter.svg'
const CURRENT_JOBS_CLOCK_ICON = '/assets/icons/clock-icon.svg'
const CURRENT_JOBS_PRICE_ICON = '/assets/icons/price-icon.svg'
const CURRENT_JOBS_DETAIL_ROUTE_ICON = '/assets/icons/detail-route.svg'
const CURRENT_JOBS_DETAIL_CARGO_ICON = '/assets/icons/detail-cargo.svg'
const CURRENT_JOBS_REPORT_ICON = '/assets/icons/report.svg'
const CURRENT_JOBS_DETAIL_CALL_ICON = '/assets/icons/detail-call.svg'
const CURRENT_JOBS_DETAIL_ROUTE_ACTION_ICON = '/assets/icons/detail-route-action.svg'
const CURRENT_JOBS_DETAIL_STATUS_ICON = '/assets/icons/detail-status.svg'
const CURRENT_JOBS_MAP_IMAGE = '/assets/images/map.png'
const CURRENT_JOBS_CHECKIN_ICON = '/assets/icons/checkin.svg'
const CURRENT_JOBS_CHECK_ICON = '/assets/icons/check.svg'
const CURRENT_JOBS_SUCCESS_ICON = '/assets/icons/success.svg'
const CURRENT_JOBS_CAMERA_ICON = '/assets/icons/camera.svg'
const CURRENT_JOBS_BOX_ICON = '/assets/icons/box.svg'
const CURRENT_JOBS_PICKER_CAMERA_ICON = '/assets/icons/picker-camera.svg'
const CURRENT_JOBS_PICKER_GALLERY_ICON = '/assets/icons/picker-gallery.svg'
const CURRENT_JOBS_SOP_DIALOG_ICON = '/assets/icons/sop-dialog.svg'
const CURRENT_JOBS_SOP_CAMERA_ICON = '/assets/icons/sop-camera.svg'
const CURRENT_JOBS_VIEW_EXPENSES_ICON = '/assets/icons/view-expenses.svg'
const CURRENT_JOBS_ADD_EXPENSE_ICON = '/assets/icons/add-expense.svg'
const CURRENT_JOBS_REPORT_ISSUE_ICON = '/assets/icons/report-issue.svg'
const CURRENT_JOBS_PAYMENT_MOBILE_ICON = '/assets/icons/payment-mobile.svg'
const CURRENT_JOBS_PAYMENT_QR_ICON = '/assets/icons/payment-qr.svg'
const CONTROL_HERO_AVATAR_IMAGE = '/assets/images/control-hero-avatar.png'
const CURRENT_JOB_EXPENSES_CONFIRM_ICON = '/assets/icons/expenses-confirm.svg'
const CURRENT_JOB_EXPENSES_COINS_ICON = '/assets/icons/expenses-coins.svg'
const ACCEPT_JOB_CONFIRM_CHECK_ICON = '/assets/icons/accept-job-confirm-check.svg'

const SETTINGS_PROFILE_AVATAR = '/assets/images/profile-avatar.png'
const SETTINGS_STATUS_SIGNAL = '/assets/icons/settings-status-signal.svg'
const SETTINGS_STATUS_WIFI = '/assets/icons/settings-status-wifi.svg'
const SETTINGS_STATUS_BATTERY = '/assets/icons/settings-status-battery.svg'
const SETTINGS_BACK_ICON = '/assets/icons/settings-back.svg'
const SETTINGS_NEXT_ICON = '/assets/icons/settings-next.svg'
const SETTINGS_PROFILE_ICON = '/assets/icons/settings-profile.svg'
const SETTINGS_DELIVERY_ICON = '/assets/icons/settings-delivery.svg'
const SETTINGS_ACTIVITY_ICON = '/assets/icons/settings-activity.svg'
const SETTINGS_LANGUAGE_ICON = '/assets/icons/settings-language.svg'
const SETTINGS_INFO_ICON = '/assets/icons/settings-info.svg'
const SETTINGS_QUESTION_ICON = '/assets/icons/settings-question.svg'
const SETTINGS_HOME_INDICATOR = '/assets/icons/settings-home-indicator.svg'
const SETTINGS_LOGOUT_POWER_ICON = '/assets/icons/settings-logout-power.svg'
const DELETE_ACCOUNT_ICON = '/assets/icons/delete-account.svg'
const VEHICLE_REGISTRATION_IMAGE = '/assets/images/vehicle-registration.png'
const VEHICLE_CAMERA_ICON = '/assets/icons/vehicle-camera.svg'
const VEHICLE_FRONT_IMAGE = '/assets/images/vehicle-front.png'
const VEHICLE_SIDE_IMAGE = '/assets/images/vehicle-side.png'
const VEHICLE_REAR_IMAGE = '/assets/images/vehicle-rear.png'

// Shipping dashboard icons - downloaded and saved locally
const SHIPPING_SIGNAL_ICON = '/assets/icons/shipping-signal.svg'
const SHIPPING_WIFI_ICON = '/assets/icons/shipping-wifi.svg'
const SHIPPING_BATTERY_ICON = '/assets/icons/shipping-battery.svg'
const SHIPPING_ARROW_LEFT_ICON = '/assets/icons/shipping-arrow-left.svg'
const SHIPPING_ARROW_DOWN_ICON = '/assets/icons/shipping-arrow-down.svg'
const SHIPPING_ARROW_UP_ICON = '/assets/icons/shipping-arrow-up.svg'
const SHIPPING_ALL_JOBS_ICON = '/assets/icons/shipping-all-jobs-icon.svg'
const SHIPPING_SUCCESS_ICON = '/assets/icons/shipping-success-icon.svg'
const SHIPPING_TRUCK_ICON_1 = '/assets/icons/shipping-truck-icon-1.svg'
const SHIPPING_TRUCK_ICON_2 = '/assets/icons/shipping-truck-icon-2.svg'
const SHIPPING_CANCEL_ICON = '/assets/icons/shipping-cancel-icon.svg'
const SHIPPING_NAV_BEFORE_ICON = '/assets/icons/shipping-nav-before.svg'
const SHIPPING_NAV_NEXT_ICON = '/assets/icons/shipping-nav-next.svg'
const SHIPPING_HOME_INDICATOR = '/assets/icons/shipping-home-indicator.svg'
const SHIPPING_ORDER_CLOCK_ICON = '/assets/icons/shipping-orders-clock.svg'
const SHIPPING_ORDER_PRICE_ICON = '/assets/icons/shipping-orders-price.svg'
const SHIPPING_ORDER_VIEW_ICON = '/assets/icons/shipping-orders-view.svg'
const SHIPPING_ORDER_CHAT_ICON = '/assets/icons/shipping-orders-chat.svg'

// Transportation icons - downloaded from Figma
const TRANSPORTATION_SEARCH_ICON = '/assets/icons/transportation-search-figma.svg'
const TRANSPORTATION_CLOCK_ICON = '/assets/icons/transportation-clock-figma.svg'
const TRANSPORTATION_LOCATION_ICON = '/assets/icons/transportation-location-dest.svg'
const TRANSPORTATION_START_ICON = '/assets/icons/transportation-start-origin.svg'
const TRANSPORTATION_CHAT_ICON = '/assets/icons/transportation-chat-figma.svg'
const TRANSPORTATION_USER_IMAGE = '/assets/images/transportation-user.png'
const TRANSPORTATION_NOTIFICATION_ICON = '/assets/icons/transportation-notification.svg'
const TRANSPORTATION_POWER_ICON = '/assets/icons/transportation-power.svg'
const TRANSPORTATION_NAV_HOME_ICON = HOME_NAV_HOME_ICON
const TRANSPORTATION_NAV_TRANSPORT_ICON = HOME_NAV_SHIPPING_ICON
const TRANSPORTATION_NAV_CHAT_ICON = HOME_NAV_CHAT_ICON
const TRANSPORTATION_NAV_SETTINGS_ICON = HOME_NAV_SETTINGS_ICON

// Vehicle dashboard icons - downloaded and saved locally
const VEHICLE_WIFI_ICON = '/assets/icons/vehicle-wifi.svg'
const VEHICLE_BATTERY_ICON = '/assets/icons/vehicle-battery.svg'
const VEHICLE_ARROW_LEFT_ICON = '/assets/icons/vehicle-arrow-left.svg'
const VEHICLE_ARROW_DOWN_ICON = '/assets/icons/vehicle-arrow-down.svg'
const VEHICLE_DIVIDER_ICON = '/assets/icons/vehicle-divider.svg'
const VEHICLE_TRUCK_ICON = '/assets/icons/vehicle-truck.svg'
const VEHICLE_TRUCK_MASK_ICON = '/assets/icons/vehicle-truck-mask.svg'
const VEHICLE_ARROW_UP_ICON = '/assets/icons/vehicle-arrow-up.svg'
const VEHICLE_CANCEL_ICON = '/assets/icons/vehicle-cancel.svg'
const VEHICLE_STATUS_AVAILABLE_ICON = '/assets/icons/vehicle-status-available.svg'
const VEHICLE_STATUS_UNAVAILABLE_ICON = '/assets/icons/vehicle-status-unavailable.svg'
const VEHICLE_NAV_BEFORE_ICON = '/assets/icons/vehicle-nav-before.svg'
const VEHICLE_NAV_NEXT_ICON = '/assets/icons/vehicle-nav-next.svg'
const VEHICLE_HOME_INDICATOR = '/assets/icons/shipping-home-indicator.svg'

// Customer dashboard icons and images - downloaded and saved locally
const CUSTOMER_AVATAR_1 = '/assets/images/customer-avatar-1.png'
const CUSTOMER_AVATAR_2 = '/assets/images/customer-avatar-2.png'
const CUSTOMER_AVATAR_3 = '/assets/images/customer-avatar-3.png'
const CUSTOMER_AVATAR_4 = '/assets/images/customer-avatar-4.png'
const CUSTOMER_AVATAR_5 = '/assets/images/customer-avatar-5.png'
const CUSTOMER_BID_ICON = '/assets/icons/customer-bid-icon.svg'
const CUSTOMER_PIE_0 = '/assets/icons/customer-pie-0.svg'
const CUSTOMER_PIE_1 = '/assets/icons/customer-pie-1.svg'
const CUSTOMER_PIE_2 = '/assets/icons/customer-pie-2.svg'
const CUSTOMER_PIE_3 = '/assets/icons/customer-pie-3.svg'
const CUSTOMER_PIE_4 = '/assets/icons/customer-pie-4.svg'
const CUSTOMER_LEGEND_DOT_1 = '/assets/icons/customer-legend-dot-1.svg'
const CUSTOMER_LEGEND_DOT_2 = '/assets/icons/customer-legend-dot-2.svg'
const CUSTOMER_LEGEND_DOT_3 = '/assets/icons/customer-legend-dot-3.svg'
const CUSTOMER_LEGEND_DOT_4 = '/assets/icons/customer-legend-dot-4.svg'
const CUSTOMER_LEGEND_DOT_5 = '/assets/icons/customer-legend-dot-5.svg'

// Product dashboard icons - downloaded and saved locally
const PRODUCT_PIE_0 = '/assets/icons/product-pie-0.svg'
const PRODUCT_PIE_1 = '/assets/icons/product-pie-1.svg'
const PRODUCT_PIE_2 = '/assets/icons/product-pie-2.svg'
const PRODUCT_PIE_3 = '/assets/icons/product-pie-3.svg'
const PRODUCT_PIE_4 = '/assets/icons/product-pie-4.svg'
const PRODUCT_LEGEND_DOT_1 = '/assets/icons/product-legend-dot-1.svg'
const PRODUCT_LEGEND_DOT_2 = '/assets/icons/product-legend-dot-2.svg'
const PRODUCT_LEGEND_DOT_3 = '/assets/icons/product-legend-dot-3.svg'
const PRODUCT_LEGEND_DOT_4 = '/assets/icons/product-legend-dot-4.svg'
const PRODUCT_LEGEND_DOT_5 = '/assets/icons/product-legend-dot-5.svg'

const PROFILE_AVATAR_IMAGE = '/assets/images/profile-avatar-alt.png'
const PROFILE_BANNER_BG = '/assets/images/profile-banner.png'
// Edit icon SVG - pencil/edit icon in a circle (white circle with gray border and pencil)
const PROFILE_EDIT_ICON_SVG = "data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='11' fill='%23FFFFFF' stroke='%23E5E5E5' stroke-width='1'/%3E%3Cpath d='M14.5 6.5L17.5 9.5L8 19H5V16L14.5 6.5Z' stroke='%234C4C4C' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3Cpath d='M12.5 8.5L15.5 11.5' stroke='%234C4C4C' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"
const PROFILE_EDIT_ICON = PROFILE_EDIT_ICON_SVG
const PROFILE_CAMERA_ICON = '/assets/icons/profile-camera.svg'

type UserRole = 'admin' | 'company' | 'customer' | 'shipping'

type UserAccount = {
  username: string
  password: string
  role: UserRole
  displayName: string
}

const USER_ACCOUNTS: UserAccount[] = [
  { username: 'admin', password: '12345', role: 'admin', displayName: 'Alex Walker' },
  { username: 'company-ops', password: '12345', role: 'company', displayName: 'Acme Logistics' },
  { username: 'company', password: '12345', role: 'customer', displayName: 'Customer Workspace' },
  { username: 'shipping', password: '12345', role: 'shipping', displayName: 'Shipping Workspace' },
]

const ACCOUNT_PASSWORD_OTP = '251079'
const EXPECTED_OTP = '123456'
const FORGOT_PASSWORD_OTP = '908172'

type View =
  | 'login'
  | 'forgotPasswordOTP'
  | 'forgotPasswordReset'
  | 'terms'
  | 'termsOfService'
  | 'policy'
  | 'info'
  | 'truck'
  | 'vehicle'
  | 'review'
  | 'verify'
  | 'home'
  | 'homeSearch'
  | 'control'
  | 'chat'
  | 'jobHistory'
  | 'jobHistoryDetail'
  | 'financial'
  | 'shippingFinance'
  | 'shipping'
  | 'shippingPage'
  | 'customers'
  | 'products'
  | 'bids'
  | 'currentJobs'
  | 'currentJobDetail'
  | 'currentJobUpdate'
  | 'currentJobUpload'
  | 'currentJobPayment'
  | 'currentJobStopInfo'
  | 'currentJobExpenses'
  | 'settings'
  | 'profile'
  | 'profileEdit'
  | 'account'
  | 'accountEditUsername'
  | 'accountEditPassword'
  | 'accountEditPasswordOTP'
  | 'deleteAccount'
  | 'vehicleInformation'
  | 'vehicleDashboard'
  | 'partialDelivery'
  | 'revenue'

type InfoFormData = {
  firstName: string
  lastName: string
  phone: string
  email: string
  username: string
  region: string
  rateMin: string
  rateMax: string
}

const INITIAL_INFO_DATA: InfoFormData = {
  firstName: 'John',
  lastName: 'Smith',
  phone: '081 234 5679',
  email: 'john.smith@email.com',
  username: '',
  region: 'Bangkok, Samut Prakan, Chonburi',
  rateMin: '1000',
  rateMax: '10000',
}

const INITIAL_TRUCK_IMAGES: Record<'front' | 'side' | 'rear' | 'plate' | 'trailer', string | null> = {
  front: null,
  side: null,
  rear: null,
  plate: null,
  trailer: null,
}

type VehicleFormData = {
  registrationNumber: string
  registrationProvince: string
  trailerRegistration: string
  trailerProvince: string
  bodyType: string
  brand: string
  model: string
  vehicleColor: string
  vin: string
  serviceYears: string
  plateType: string
  payload: string
  weightFront: string
  weightRear: string
  weightTotal: string
  insuranceValue: string
}

const INITIAL_VEHICLE_DATA: VehicleFormData = {
  registrationNumber: '',
  registrationProvince: '',
  trailerRegistration: '',
  trailerProvince: '',
  bodyType: '',
  brand: '',
  model: '',
  vehicleColor: '',
  vin: '',
  serviceYears: '',
  plateType: '',
  payload: '',
  weightFront: '',
  weightRear: '',
  weightTotal: '',
  insuranceValue: '',
}

const INITIAL_VEHICLE_DOCS: Record<'registration' | 'insurance' | 'ownership' | 'tax', string | null> = {
  registration: null,
  insurance: null,
  ownership: null,
  tax: null,
}

type TrailerOptions = {
  box20: boolean
  box40: boolean
}

type ExpenseEntry = {
  id: string
  jobId: string
  stopId: string
  title: string
  category: string
  amount: number
  currency: string
  date: string
  description?: string
  receiptUrl?: string
  receiptUrls?: string[]
}

const INITIAL_EXPENSES_BY_STOP: Record<string, ExpenseEntry[]> = {
  'job-1:job-1-pickup': [
    {
      id: 'expense-1',
      jobId: 'job-1',
      stopId: 'job-1-pickup',
      title: 'Dock loading fee',
      category: 'Loading services',
      amount: 250,
      currency: 'THB',
      date: '2025-08-15',
      description: 'Fee for using the loading dock at Bangkok Distribution Center.',
    },
    {
      id: 'expense-2',
      jobId: 'job-1',
      stopId: 'job-1-pickup',
      title: 'Security clearance badge',
      category: 'Permits',
      amount: 120,
      currency: 'THB',
      date: '2025-08-15',
      description: 'Temporary badge issued for warehouse access.',
    },
  ],
  'job-1:job-1-dropoff': [
    {
      id: 'expense-3',
      jobId: 'job-1',
      stopId: 'job-1-dropoff',
      title: 'Cooling surcharge',
      category: 'Reefer maintenance',
      amount: 320,
      currency: 'THB',
      date: '2025-08-15',
      description: 'Additional cooling charge requested at Chiang Mai drop-off.',
    },
  ],
}

const INITIAL_TRAILER_OPTIONS: TrailerOptions = {
  box20: false,
  box40: false,
}

function App() {
  const [view, setView] = useState<View>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [activeUser, setActiveUser] = useState<UserAccount | null>(null)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', ''])
  const [otpTimer, setOtpTimer] = useState(60)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [infoData, setInfoData] = useState<InfoFormData>(INITIAL_INFO_DATA)
  const [truckImages, setTruckImages] = useState<typeof INITIAL_TRUCK_IMAGES>({ ...INITIAL_TRUCK_IMAGES })
  const [hasTrailer, setHasTrailer] = useState(false)
  const [vehicleData, setVehicleData] = useState<VehicleFormData>(INITIAL_VEHICLE_DATA)
  const [vehicleDocs, setVehicleDocs] = useState<typeof INITIAL_VEHICLE_DOCS>({ ...INITIAL_VEHICLE_DOCS })
  const [trailerOptions, setTrailerOptions] = useState<TrailerOptions>(INITIAL_TRAILER_OPTIONS)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [detailSource, setDetailSource] = useState<'current' | 'history' | null>(null)
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null)
  const [checkedInStops, setCheckedInStops] = useState<Record<string, boolean>>({})
  const [submittedSop, setSubmittedSop] = useState<Record<string, { url: string; name: string }>>({})
  const [startedJobs, setStartedJobs] = useState<Record<string, boolean>>({})
  const [activeTaskByJob, setActiveTaskByJob] = useState<Record<string, string | null>>({})
  const [paidStops, setPaidStops] = useState<Record<string, boolean>>({})
  const [paymentMethodByStop, setPaymentMethodByStop] = useState<Record<string, string>>({})
  const [expensesByStop, setExpensesByStop] = useState<Record<string, ExpenseEntry[]>>({ ...INITIAL_EXPENSES_BY_STOP })
  const [expenseMode, setExpenseMode] = useState<'view' | 'add'>('view')
  const [expenseOrigin, setExpenseOrigin] = useState<'update' | 'info' | 'detail' | null>(null)
  const [availableJobs, setAvailableJobs] = useState<RecommendedJob[]>(() => RECOMMENDED_JOBS.map((job) => ({ ...job })))
  const [acceptedJobs, setAcceptedJobs] = useState<RecommendedJob[]>([])
  const [podNotification, setPodNotification] = useState<{ jobId: string; stopId: string } | null>(null)
  const podNotificationTimeoutRef = useRef<number | null>(null)
  const [bidOrders, setBidOrders] = useState<BidOrder[]>(() => MOCK_BID_ORDERS.map((bid) => ({ ...bid })))

  // Fetch real data from API when logged in
  const { recommendedJobs: apiJobs, bidOrders: apiBids, refetchJobs, refetchBids } = useHomeData()
  const { stats: dashboardStats } = useDashboardData()

  // Update jobs from API data
  useEffect(() => {
    if (activeUser && apiJobs.length > 0) {
      // Transform API jobs to match the RecommendedJob type
      const transformedJobs: RecommendedJob[] = apiJobs.map((job) => ({
        ...job,
        // Ensure all required fields are present
        id: job.id,
        codeLabel: job.codeLabel,
        date: job.date,
        time: job.time,
        employer: job.employer,
        jobType: job.jobType,
        price: job.price,
        direction: job.direction,
        category: job.category,
        route: job.route,
        startDate: job.startDate,
        startTime: job.startTime,
        sections: job.sections,
      }))
      setAvailableJobs(transformedJobs)
    }
  }, [activeUser, apiJobs])

  // Update bids from API data
  useEffect(() => {
    if (activeUser && apiBids.length > 0) {
      setBidOrders(apiBids)
    }
  }, [activeUser, apiBids])

  const handleSubmitBid = (bidId: string, amount: number) => {
    setBidOrders((prevBids) =>
      prevBids.map((bid) =>
        bid.id === bidId
          ? {
              ...bid,
              status: 'history' as const,
              submittedAmount: amount,
            }
          : bid
      )
    )
  }

  useEffect(() => {
    if (view !== 'forgotPasswordOTP') {
      return
    }
    if (otpTimer <= 0) {
      return
    }
    const timerId = window.setTimeout(() => {
      setOtpTimer((current) => Math.max(current - 1, 0))
    }, 1000)

    return () => window.clearTimeout(timerId)
  }, [view, otpTimer])

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })

  const handleAvatarSelect = async (file: File | null) => {
    if (!file) {
      setAvatarPreview(null)
      return
    }
    try {
      const dataUrl = await readFileAsDataUrl(file)
      setAvatarPreview(dataUrl)
    } catch (error) {
      console.error('Failed to read avatar file', error)
    }
  }

  const handleInfoChange = (field: keyof InfoFormData, value: string) => {
    setInfoData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleTruckImageSelect = async (key: keyof typeof INITIAL_TRUCK_IMAGES, file: File | null) => {
    if (!file) {
      setTruckImages((prev) => ({
        ...prev,
        [key]: null,
      }))
      return
    }
    try {
      const dataUrl = await readFileAsDataUrl(file)
      setTruckImages((prev) => ({
        ...prev,
        [key]: dataUrl,
      }))
    } catch (error) {
      console.error('Failed to read truck image file', error)
    }
  }

  const handleVehicleChange = (field: keyof VehicleFormData, value: string) => {
    setVehicleData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleVehicleDocSelect = async (key: keyof typeof INITIAL_VEHICLE_DOCS, file: File | null) => {
    if (!file) {
      setVehicleDocs((prev) => ({
        ...prev,
        [key]: null,
      }))
      return
    }
    try {
      const dataUrl = await readFileAsDataUrl(file)
      setVehicleDocs((prev) => ({
        ...prev,
        [key]: dataUrl,
      }))
    } catch (error) {
      console.error('Failed to read vehicle document file', error)
    }
  }

  const handleTrailerOptionToggle = (option: keyof TrailerOptions) => (value: boolean) => {
    setTrailerOptions((prev) => ({
      ...prev,
      [option]: value,
    }))
  }

  const getExpenseKey = (jobId: string, stopId: string) => `${jobId}:${stopId}`

  const addExpenseEntry = (
    jobId: string,
    stopId: string,
    entry: Omit<ExpenseEntry, 'id' | 'jobId' | 'stopId'>,
  ) => {
    setExpensesByStop((prev) => {
      const key = getExpenseKey(jobId, stopId)
      const existing = prev[key] ?? []
      const newEntry: ExpenseEntry = {
        id: `expense-${Date.now()}`,
        jobId,
        stopId,
        ...entry,
      }
      return {
        ...prev,
        [key]: [newEntry, ...existing],
      }
    })
  }

  const dismissPodNotification = () => {
    if (podNotificationTimeoutRef.current !== null) {
      window.clearTimeout(podNotificationTimeoutRef.current)
      podNotificationTimeoutRef.current = null
    }
    setPodNotification(null)
  }

  useEffect(() => {
    if (!podNotification) {
      return undefined
    }

    if (podNotificationTimeoutRef.current !== null) {
      window.clearTimeout(podNotificationTimeoutRef.current)
    }

    podNotificationTimeoutRef.current = window.setTimeout(() => {
      setPodNotification(null)
      podNotificationTimeoutRef.current = null
    }, 4000)

    return () => {
      if (podNotificationTimeoutRef.current !== null) {
        window.clearTimeout(podNotificationTimeoutRef.current)
        podNotificationTimeoutRef.current = null
      }
    }
  }, [podNotification])

  const startSignUpFlow = () => {
    resetFlow('terms')
  }

  const resetFlow = (nextView: View = 'login', options?: { resetUser?: boolean }) => {
    setUsername('')
    setPassword('')
    setErrorMessage('')
    setIsPasswordVisible(false)
    setAvatarPreview(null)
    setInfoData(INITIAL_INFO_DATA)
    setTruckImages({ ...INITIAL_TRUCK_IMAGES })
    setHasTrailer(false)
    setVehicleData(INITIAL_VEHICLE_DATA)
    setVehicleDocs({ ...INITIAL_VEHICLE_DOCS })
    setTrailerOptions(INITIAL_TRAILER_OPTIONS)
    setSelectedJobId(null)
    setSelectedStopId(null)
    setCheckedInStops({})
    setSubmittedSop({})
    setStartedJobs({})
    setActiveTaskByJob({})
    setPaidStops({})
    setPaymentMethodByStop({})
    setExpensesByStop({ ...INITIAL_EXPENSES_BY_STOP })
    setExpenseMode('view')
    setExpenseOrigin(null)
    setAvailableJobs(RECOMMENDED_JOBS.map((job) => ({ ...job })))
    setAcceptedJobs([])
    dismissPodNotification()
    if (options?.resetUser) {
      setActiveUser(null)
    }
    setView(nextView)
  }

  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedUsername = username.trim().toLowerCase()
    const trimmedPassword = password.trim()

    if (isLoggingIn) return
    setIsLoggingIn(true)
    setErrorMessage('')

    try {
      const response = await api.auth.login(trimmedUsername, trimmedPassword)
      setAuthToken(response.token)
      
      const userAccount: UserAccount = {
        username: response.user.username,
        password: '',
        role: response.user.role,
        displayName: response.user.displayName,
      }
      
      setActiveUser(userAccount)
      setErrorMessage('')
      resetFlow('home')
    } catch (error: any) {
      setErrorMessage(error.message || 'Incorrect username or password. Please try again.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const activePodNotification = useMemo(() => {
    if (!podNotification || !selectedJobId || podNotification.jobId !== selectedJobId) {
      return null
    }

    const detail = CURRENT_JOB_DETAILS[selectedJobId] ?? CURRENT_JOB_DETAILS['job-1']
    const stop = detail.stops.find((entry) => entry.id === podNotification.stopId)
    const isPaid = stop ? Boolean(paidStops[stop.id]) : false
    const stageLabel = isPaid ? 'POD' : 'SOP'

    return {
      title: `${stageLabel} confirmed`,
      description: stop
        ? `${stageLabel} photo submitted for ${stop.title}.`
        : `${stageLabel} photo submitted.`,
    }
  }, [paidStops, podNotification, selectedJobId])

  const handleAcceptRecommendedJob = (jobId: string) => {
    setAvailableJobs((previousJobs) => {
      const jobToAccept = previousJobs.find((job) => job.id === jobId)
      if (!jobToAccept) {
        return previousJobs
      }
      setAcceptedJobs((previousAccepted) => {
        if (previousAccepted.some((job) => job.id === jobId)) {
          return previousAccepted
        }
        return [...previousAccepted, jobToAccept]
      })
      return previousJobs.filter((job) => job.id !== jobId)
    })
  }

  const handleBottomNavSelect = (tab: BottomNavTab) => {
    if (tab === 'home') {
      setView('home')
    } else if (tab === 'control') {
      setView('control')
    } else if (tab === 'chat') {
      setView('chat')
    } else if (tab === 'settings') {
      setView('settings')
    } else if (tab === 'shipping') {
      setView('shipping')
    }
  }

  const companyProfile = activeUser?.role === 'company' ? activeUser : null
  const customerProfile = activeUser?.role === 'customer' ? activeUser : null
  const shippingProfile = activeUser?.role === 'shipping' ? activeUser : null

  // Render chat screen inside app-surface for consistent layout
  if (view === 'chat') {
    return (
      <div className="app-surface">
        <ChatScreen onSelectTab={handleBottomNavSelect} userRole={activeUser?.role} />
      </div>
    )
  }

  return (
    <div className="app-surface">
      {view === 'home' ? (
        shippingProfile ? (
          <ShippingHomeScreen
            displayName={shippingProfile.displayName}
            onOpenFinancial={() => setView('shippingFinance')}
            onOpenBids={() => setView('bids')}
            onOpenShipping={() => setView('shippingPage')}
            onOpenCustomers={() => setView('customers')}
            onOpenProducts={() => setView('products')}
            onOpenVehicleInformation={() => setView('vehicleDashboard')}
            onSelectTab={handleBottomNavSelect}
            onLogout={() => resetFlow('login', { resetUser: true })}
          />
        ) : customerProfile ? (
          <CustomerHomeScreen
            jobs={availableJobs}
            onAcceptJob={handleAcceptRecommendedJob}
            onOpenCurrentJobs={() => {
              setSelectedJobId(null)
              setSelectedStopId(null)
              setView('currentJobs')
            }}
            onOpenFinancial={() => setView('revenue')}
            onOpenShipping={() => setView('shippingPage')}
            onOpenCustomers={() => setView('customers')}
            onOpenJobHistory={() => setView('jobHistory')}
            onOpenBids={() => setView('bids')}
            onOpenProducts={() => setView('products')}
            onOpenSearch={() => setView('homeSearch')}
            onSelectTab={handleBottomNavSelect}
          />
        ) : companyProfile ? (
          <CompanyHomeScreen
            displayName={companyProfile.displayName}
            onOpenCurrentJobs={() => {
              setSelectedJobId(null)
              setSelectedStopId(null)
              setView('currentJobs')
            }}
            onOpenFinancial={() => setView('revenue')}
            onOpenCustomers={() => setView('customers')}
            onOpenJobHistory={() => setView('jobHistory')}
            onOpenBids={() => setView('bids')}
            onSelectTab={handleBottomNavSelect}
          />
        ) : (
          <HomeScreen
            jobs={availableJobs}
            onAcceptJob={handleAcceptRecommendedJob}
            onOpenCurrentJobs={() => {
              setSelectedJobId(null)
              setSelectedStopId(null)
              setView('currentJobs')
            }}
            onOpenFinancial={() => setView('revenue')}
            onOpenShipping={() => setView('shippingPage')}
            onOpenCustomers={() => setView('customers')}
            onOpenJobHistory={() => setView('jobHistory')}
            onOpenBids={() => setView('bids')}
            onOpenProducts={() => setView('products')}
            onOpenSearch={() => setView('homeSearch')}
            onSelectTab={handleBottomNavSelect}
          />
        )
      ) : view === 'homeSearch' ? (
        <HomeSearchScreen jobs={availableJobs} onAcceptJob={handleAcceptRecommendedJob} onBack={() => setView('home')} />
      ) : view === 'control' ? (
        <ControlScreen
          onOpenFinancial={() => setView('financial')}
          onOpenShipping={() => setView('shipping')}
          onOpenCustomers={() => setView('customers')}
          onOpenProducts={() => setView('products')}
          onSelectTab={handleBottomNavSelect}
        />
      ) : view === 'jobHistory' ? (
        <JobHistoryScreen
          onBack={() => setView('home')}
          onOpenJob={(jobId) => {
            setSelectedJobId(jobId)
            setDetailSource('history')
            setView('jobHistoryDetail')
          }}
        />
      ) : view === 'jobHistoryDetail' && selectedJobId ? (
        <JobHistoryDetailScreen
          jobId={selectedJobId}
          onBack={() => setView('jobHistory')}
        />
      ) : view === 'currentJobs' ? (
        <CurrentJobsScreen
          jobs={acceptedJobs}
          onBack={() => setView('home')}
          onOpenJob={(jobId) => {
            setSelectedJobId(jobId)
            setSelectedStopId(null)
            setView('currentJobDetail')
          }}
        />
      ) : view === 'currentJobDetail' && selectedJobId ? (
        <CurrentJobDetailScreen
          jobId={selectedJobId}
          onBack={() => {
            setSelectedStopId(null)
            setView('currentJobs')
          }}
          onClose={() => {
            setSelectedJobId(null)
            setSelectedStopId(null)
            setView('home')
          }}
          onOpenStatus={(stopId) => {
            setSelectedStopId(stopId)
            if (checkedInStops[stopId]) {
              setView('currentJobUpload')
            } else {
              setView('currentJobUpdate')
            }
          }}
          onOpenPayment={(stopId) => {
            setSelectedStopId(stopId)
            setView('currentJobPayment')
          }}
          onOpenInfo={(stopId) => {
            setSelectedStopId(stopId)
            setView('currentJobStopInfo')
          }}
          checkedInStops={checkedInStops}
          submittedSop={submittedSop}
          paidStops={paidStops}
          paymentMethodByStop={paymentMethodByStop}
          jobStarted={Boolean(startedJobs[selectedJobId])}
          nextTaskStopId={activeTaskByJob[selectedJobId] ?? null}
          canStartJob={(() => {
            const detail = CURRENT_JOB_DETAILS[selectedJobId] ?? CURRENT_JOB_DETAILS['job-1']
            const statusStops = detail.stops.filter((stop) =>
              stop.actions.some((action) => action.key === 'status'),
            )
            if (statusStops.length === 0) {
              return true
            }
            return statusStops.every((stop) => Boolean(submittedSop[stop.id]))
          })()}
          onStartJob={() => {
            const detail = CURRENT_JOB_DETAILS[selectedJobId] ?? CURRENT_JOB_DETAILS['job-1']
            const statusStopIndex = detail.stops.findIndex((stop) =>
              stop.actions.some((action) => action.key === 'status'),
            )
            const nextStop = statusStopIndex >= 0 ? detail.stops[statusStopIndex + 1] : undefined
            setStartedJobs((prev) => ({ ...prev, [selectedJobId]: true }))
            setActiveTaskByJob((prev) => ({
              ...prev,
              [selectedJobId]: nextStop ? nextStop.id : null,
            }))
          }}
          notification={activePodNotification}
          onDismissNotification={dismissPodNotification}
        />
      ) : view === 'currentJobUpdate' && selectedJobId && selectedStopId ? (
        <CurrentJobUpdateScreen
          jobId={selectedJobId}
          stopId={selectedStopId}
          onBack={() => setView('currentJobDetail')}
          onClose={() => {
            setSelectedStopId(null)
            setSelectedJobId(null)
            setView('home')
          }}
          checkedInStops={checkedInStops}
          paidStops={paidStops}
          paymentMethodByStop={paymentMethodByStop}
          submittedSop={submittedSop}
          onOpenPayment={(stopId) => {
            setSelectedStopId(stopId)
            setView('currentJobPayment')
          }}
          onOpenSop={(stopId) => {
            setSelectedStopId(stopId)
            setView('currentJobUpload')
          }}
          onViewExpenses={() => {
            setExpenseMode('view')
            setExpenseOrigin('update')
            setView('currentJobExpenses')
          }}
          onAddExpense={() => {
            setExpenseMode('add')
            setExpenseOrigin('update')
            setView('currentJobExpenses')
          }}
          onReportIssue={() => {
            // Modal is handled internally by CurrentJobUpdateScreen
          }}
          onConfirmCheckIn={(stopId) => {
            setCheckedInStops((prev) => ({ ...prev, [stopId]: true }))
            const detail = CURRENT_JOB_DETAILS[selectedJobId] ?? CURRENT_JOB_DETAILS['job-1']
            const stop = detail.stops.find((entry) => entry.id === stopId)
            const currentIndex = detail.stops.findIndex((stop) => stop.id === stopId)
            const remainingStops = currentIndex >= 0 ? detail.stops.slice(currentIndex + 1) : []
            const nextStatusStop =
              remainingStops.find((stop) => stop.actions.some((action) => action.key === 'status')) ?? null
            setActiveTaskByJob((prev) => ({
              ...prev,
              [selectedJobId]: nextStatusStop ? nextStatusStop.id : null,
            }))
            if (stop && stop.actions.some((action) => action.key === 'status')) {
              setSelectedStopId(stopId)
              setView('currentJobUpload')
              return
            }
            if (nextStatusStop) {
              setSelectedStopId(nextStatusStop.id)
              setView('currentJobUpdate')
              return
            }
            setSelectedStopId(stopId)
            setView('currentJobPayment')
          }}
        />
      ) : view === 'currentJobUpload' && selectedJobId && selectedStopId ? (
        <CurrentJobUploadScreen
          jobId={selectedJobId}
          stopId={selectedStopId}
          checkedInStops={checkedInStops}
          isPaid={Boolean(paidStops[selectedStopId])}
          onBack={() => setView('currentJobDetail')}
          onClose={() => {
            setSelectedStopId(null)
            setSelectedJobId(null)
            setView('home')
          }}
          existingPhoto={submittedSop[selectedStopId] ?? null}
          onSubmitSop={async (file) => {
            if (!selectedStopId) {
              return
            }
            try {
              const dataUrl = await readFileAsDataUrl(file)
              setSubmittedSop((prev) => ({
                ...prev,
                [selectedStopId]: { url: dataUrl, name: file.name },
              }))
              if (selectedJobId) {
                setPodNotification({ jobId: selectedJobId, stopId: selectedStopId })
              }
              setView('currentJobDetail')
            } catch (error) {
              console.error('Failed to read POD photo', error)
            }
          }}
          onViewInfo={() => setView('currentJobStopInfo')}
        />
      ) : view === 'currentJobPayment' && selectedJobId && selectedStopId ? (
        <CurrentJobPaymentScreen
          jobId={selectedJobId}
          stopId={selectedStopId}
          onBack={() => setView('currentJobDetail')}
          onClose={() => {
            setSelectedStopId(null)
            setSelectedJobId(null)
            setView('home')
          }}
          onConfirmPayment={(stopId, methodLabel) => {
            setPaidStops((prev) => ({ ...prev, [stopId]: true }))
            setPaymentMethodByStop((prev) => ({ ...prev, [stopId]: methodLabel }))
            setSelectedStopId(stopId)
            setView('currentJobUpdate')
          }}
          initialMethod={paymentMethodByStop[selectedStopId]}
        />
      ) : view === 'currentJobStopInfo' && selectedJobId && selectedStopId ? (
        <CurrentJobStopInfoScreen
          jobId={selectedJobId}
          stopId={selectedStopId}
          onBack={() => setView('currentJobDetail')}
          onClose={() => {
            setSelectedStopId(null)
            setSelectedJobId(null)
            setView('home')
          }}
          checkedInStops={checkedInStops}
          paidStops={paidStops}
          paymentMethodByStop={paymentMethodByStop}
          submittedSop={submittedSop}
          onViewExpenses={() => {
            setExpenseMode('view')
            setExpenseOrigin('info')
            setView('currentJobExpenses')
          }}
          onAddExpense={() => {
            setExpenseMode('add')
            setExpenseOrigin('info')
            setView('currentJobExpenses')
          }}
          onReportIssue={() => {
            // Modal is handled internally by CurrentJobUpdateScreen
          }}
        />
      ) : view === 'currentJobExpenses' && selectedJobId && selectedStopId ? (
        <CurrentJobExpensesScreen
          jobId={selectedJobId}
          stopId={selectedStopId}
          mode={expenseMode}
          expenses={expensesByStop[getExpenseKey(selectedJobId, selectedStopId)] ?? []}
          onBack={() => {
            if (expenseOrigin === 'update') {
              setView('currentJobUpdate')
            } else if (expenseOrigin === 'info') {
              setView('currentJobStopInfo')
            } else {
              setView('currentJobDetail')
            }
            setExpenseOrigin(null)
            setExpenseMode('view')
          }}
          onClose={() => {
            setSelectedStopId(null)
            setSelectedJobId(null)
            setExpenseOrigin(null)
            setView('home')
          }}
          onSubmitExpense={(entry) => {
            addExpenseEntry(selectedJobId, selectedStopId, entry)
            setExpenseMode('view')
            setView('currentJobStopInfo')
            setExpenseOrigin(null)
          }}
        />
      ) : view === 'partialDelivery' && selectedJobId && selectedStopId ? (
        <PartialDeliveryPage
          onBack={() => setView('currentJobStopInfo')}
          onViewExpenses={() => {
            setExpenseMode('view')
            setExpenseOrigin('info')
            setView('currentJobExpenses')
          }}
          onAddExpense={() => {
            setExpenseMode('add')
            setExpenseOrigin('info')
            setView('currentJobExpenses')
          }}
          onReportIssue={() => {
            // Modal is handled internally by PartialDeliveryPage
          }}
          onCall={() => {
            // Handle call action
            console.log('Call clicked')
          }}
          onDirections={() => {
            // Handle directions action
            console.log('Directions clicked')
          }}
          onCheckin={() => {
            // Handle checkin action
            console.log('Checkin clicked')
          }}
          onPayment={() => {
            setView('currentJobPayment')
          }}
        />
      ) : view === 'revenue' ? (
        <RevenueScreen
          onBack={() => {
            setSelectedJobId(null)
            setSelectedStopId(null)
            setView('home')
          }}
        />
      ) : view === 'bids' ? (
        activeUser?.role === 'shipping' ? (
          <BiddingStatisticsScreen
            onBack={() => {
              setSelectedJobId(null)
              setSelectedStopId(null)
              setView('home')
            }}
          />
        ) : (
          <BidsScreen
            onBack={() => {
              setSelectedJobId(null)
              setSelectedStopId(null)
              setView('home')
            }}
            orders={bidOrders}
            onSubmitBid={handleSubmitBid}
          />
        )
      ) : view === 'settings' ? (
        <SettingsScreen
          onBack={() => setView('home')}
          onSelectTab={handleBottomNavSelect}
          onOpenTermsOfService={() => setView('termsOfService')}
          onLogout={() => {
            resetFlow('login', { resetUser: true })
          }}
          onOpenProfile={() => setView('profile')}
          onOpenAccount={() => setView('account')}
          onOpenVehicleInformation={() => setView('vehicleInformation')}
        />
      ) : view === 'vehicleInformation' ? (
        <VehicleInformationScreen
          onBack={() => setView('settings')}
        />
      ) : view === 'termsOfService' ? (
        <TermsOfServiceScreen
          onBack={() => setView('settings')}
        />
      ) : view === 'vehicleDashboard' ? (
        <VehicleDashboardScreen
          onBack={() => setView('home')}
        />
      ) : view === 'account' ? (
        <AccountScreen
          onBack={() => setView('settings')}
          onEditPassword={() => setView('accountEditPassword')}
          onDeleteAccount={() => setView('deleteAccount')}
        />
      ) : view === 'deleteAccount' ? (
        <DeleteAccountDialog
          onBack={() => setView('account')}
          onConfirm={() => {
            // Handle account deletion here
            setView('login')
          }}
        />
      ) : view === 'accountEditPassword' ? (
        <AccountEditPasswordScreen
          onBack={() => setView('account')}
          onSave={() => setView('accountEditPasswordOTP')}
        />
      ) : view === 'accountEditPasswordOTP' ? (
        <AccountPasswordOTPScreen
          onBack={() => setView('accountEditPassword')}
          onVerified={() => setView('account')}
        />
      ) : view === 'profile' ? (
        <ProfileScreen
          onBack={() => setView('settings')}
          onEdit={() => setView('profileEdit')}
          profileData={infoData}
          avatarPreview={avatarPreview}
          onAvatarSelect={handleAvatarSelect}
        />
      ) : view === 'profileEdit' ? (
        <ProfileEditScreen
          onBack={() => setView('profile')}
          onSave={() => setView('profile')}
          profileData={infoData}
          onProfileChange={handleInfoChange}
          avatarPreview={avatarPreview}
          onAvatarSelect={handleAvatarSelect}
        />
      ) : view === 'shippingFinance' ? (
        <ShippingFinanceScreen onBack={() => setView('home')} />
      ) : view === 'financial' ? (
        <FinancialScreen onBack={() => setView('home')} />
      ) : view === 'shipping' ? (
        <TransportationScreen onBack={() => setView('home')} onSelectTab={handleBottomNavSelect} />
      ) : view === 'shippingPage' ? (
        <ShippingScreen onBack={() => setView('home')} />
      ) : view === 'customers' ? (
        activeUser?.role === 'shipping' ? (
          <CustomerStatisticsScreen onBack={() => setView('home')} />
        ) : (
          <CustomersScreen onBack={() => setView('home')} />
        )
      ) : view === 'products' ? (
        activeUser?.role === 'shipping' ? (
          <ProductStatisticsScreen onBack={() => setView('home')} />
        ) : (
          <ProductsScreen onBack={() => setView('home')} />
        )
      ) : view === 'forgotPasswordOTP' ? (
        <ForgotPasswordOTPScreen
          phoneNumber={phoneNumber}
          otpCode={otpCode}
          otpTimer={otpTimer}
          errorMessage={errorMessage}
          onOtpChange={(index, value) => {
            setOtpCode((previous) => {
              const updated = [...previous]
              updated[index] = value
              return updated
            })
          }}
          onBack={() => {
            setView('login')
            setShowForgotPassword(true)
            setOtpCode(['', '', '', '', '', ''])
            setOtpTimer(60)
            setErrorMessage('')
          }}
          onResendOtp={() => {
            setOtpTimer(60)
            setOtpCode(['', '', '', '', '', ''])
            setErrorMessage('')
          }}
          onContinue={() => {
            const enteredOtp = otpCode.join('')
            if (enteredOtp === FORGOT_PASSWORD_OTP) {
              setErrorMessage('')
              setView('forgotPasswordReset')
            } else {
              setErrorMessage('Invalid OTP code. Please try again.')
            }
          }}
        />
      ) : view === 'forgotPasswordReset' ? (
        <ForgotPasswordResetScreen
          onPasswordReset={(_newPassword) => {
            setPassword('')
            setView('login')
            setShowForgotPassword(false)
            setPhoneNumber('')
            setOtpCode(['', '', '', '', '', ''])
            setOtpTimer(60)
            setErrorMessage('')
          }}
          onLogin={() => {
            setView('login')
            setShowForgotPassword(false)
            setPhoneNumber('')
            setOtpCode(['', '', '', '', '', ''])
            setOtpTimer(60)
            setErrorMessage('')
          }}
        />
      ) : view === 'login' ? (
        <LoginScreen
          username={username}
          password={password}
          errorMessage={errorMessage}
          isPasswordVisible={isPasswordVisible}
          showForgotPassword={showForgotPassword}
          phoneNumber={phoneNumber}
          onUsernameChange={(value) => {
            setUsername(value)
            if (errorMessage) {
              setErrorMessage('')
            }
          }}
          onPasswordChange={(value) => {
            setPassword(value)
            if (errorMessage) {
              setErrorMessage('')
            }
          }}
          onTogglePasswordVisibility={() => setIsPasswordVisible((current) => !current)}
          onSubmit={handleSubmit}
          onSignUp={startSignUpFlow}
          onForgotPasswordClick={() => setShowForgotPassword(true)}
          onBackToLogin={() => {
            setShowForgotPassword(false)
            setPhoneNumber('')
            setErrorMessage('')
          }}
          onPhoneNumberChange={(value) => {
            setPhoneNumber(value)
            if (errorMessage) {
              setErrorMessage('')
            }
          }}
          onForgotPasswordSubmit={(e) => {
            e.preventDefault()
            if (phoneNumber.trim()) {
              setView('forgotPasswordOTP')
              setOtpCode(['', '', '', '', '', ''])
              setOtpTimer(60)
              setErrorMessage('')
            }
          }}
        />
      ) : view === 'terms' ? (
        <TermsScreen
          onBack={() => {
            setView('login')
            setPassword('')
            setIsPasswordVisible(false)
          }}
          onContinue={() => setView('policy')}
        />
      ) : view === 'policy' ? (
        <PolicyScreen
          onBack={() => setView('terms')}
          onFinish={() => setView('info')}
        />
      ) : view === 'info' ? (
        <InfoScreen
          onBack={() => setView('policy')}
          onContinue={() => setView('truck')}
          data={infoData}
          onChange={handleInfoChange}
          avatarPreview={avatarPreview}
          onAvatarSelect={handleAvatarSelect}
        />
      ) : view === 'truck' ? (
        <TruckScreen
          onBack={() => setView('info')}
          onFinish={() => setView('vehicle')}
          images={truckImages}
          onImageSelect={handleTruckImageSelect}
          hasTrailer={hasTrailer}
          onToggleTrailer={(value) => setHasTrailer(value)}
        />
      ) : view === 'vehicle' ? (
        <VehicleInfoScreen
          onBack={() => setView('truck')}
          onContinue={() => setView('review')}
          data={vehicleData}
          onChange={handleVehicleChange}
          trailerOptions={trailerOptions}
          onTrailerOptionChange={handleTrailerOptionToggle}
          vehicleDocs={vehicleDocs}
          onDocSelect={handleVehicleDocSelect}
        />
      ) : view === 'review' ? (
        <ReviewScreen
          onBack={(nextView) => setView(nextView)}
          onSubmit={() => setView('verify')}
          infoData={infoData}
          avatarPreview={avatarPreview}
          truckImages={truckImages}
          hasTrailer={hasTrailer}
          vehicleData={vehicleData}
          trailerOptions={trailerOptions}
          vehicleDocs={vehicleDocs}
        />
      ) : (
        <VerificationScreen
          onBack={() => setView('review')}
          onVerified={() => resetFlow('home')}
        />
      )}
    </div>
  )
}

type LoginScreenProps = {
  username: string
  password: string
  errorMessage: string
  isPasswordVisible: boolean
  showForgotPassword: boolean
  phoneNumber: string
  onUsernameChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onTogglePasswordVisibility: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onSignUp: () => void
  onForgotPasswordClick: () => void
  onBackToLogin: () => void
  onPhoneNumberChange: (value: string) => void
  onForgotPasswordSubmit: (event: FormEvent<HTMLFormElement>) => void
}

function LoginScreen({
  username,
  password,
  errorMessage,
  isPasswordVisible,
  showForgotPassword,
  phoneNumber,
  onUsernameChange,
  onPasswordChange,
  onTogglePasswordVisibility,
  onSubmit,
  onSignUp,
  onForgotPasswordClick,
  onBackToLogin,
  onPhoneNumberChange,
  onForgotPasswordSubmit,
}: LoginScreenProps) {
  const { t } = useTranslation()
  const hasError = Boolean(errorMessage)

  return (
    <div className="signin-screen" role="presentation">
      <section className="hero" aria-labelledby="signin-title">
        <div className="hero-background">
          <div className="hero-overlay" />
        </div>
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-phone" aria-hidden="true">
          <div className="hero-phone-body">
            <div className="hero-phone-screen">
              <img src={CITY_IMAGE} alt="City skyline reflection" loading="lazy" />
            </div>
          </div>
        </div>
        <img className="hero-truck" src={TRUCK_IMAGE} alt="Green delivery truck" loading="lazy" />
        <img className="hero-pin" src={MAP_PIN_IMAGE} alt="Delivery location pin" loading="lazy" />
        <div className="hero-brand">
          <div className="brand-top">
            <span className="brand-icon" aria-hidden="true" />
            <span className="brand-the">The</span>
          </div>
          <span className="brand-truckers">Truckers</span>
        </div>
      </section>

      <main className="form-card">
        <div className="form-card-language">
          <LanguageSwitcher />
        </div>
        {showForgotPassword ? (
          <>
            <h1 id="signin-title">{t('auth.forgotPasswordTitle')}</h1>
            <form className="form" aria-label={t('auth.forgotPasswordTitle')} noValidate onSubmit={onForgotPasswordSubmit}>
              <label className={`form-field ${hasError ? 'error' : ''}`}>
                <span className="form-label">
                  {t('auth.phoneNumber')} <span className="required" aria-hidden="true">*</span>
                </span>
                <input
                  type="tel"
                  name="phone"
                  placeholder={t('auth.enterPhoneNumber')}
                  autoComplete="tel"
                  value={phoneNumber}
                  onChange={(event) => onPhoneNumberChange(event.target.value)}
                  aria-invalid={hasError}
                  required
                />
              </label>

              {hasError && (
                <p className="form-error" role="alert">
                  {errorMessage}
                </p>
              )}

              <div className="action-buttons">
                <button type="submit" className="btn btn-primary">
                  {t('common.confirm')}
                </button>
                <button type="button" className="btn btn-secondary" onClick={onBackToLogin}>
                  {t('auth.login')}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h1 id="signin-title">{t('auth.signInOrCreate')}</h1>
            <form className="form" aria-label={t('auth.signIn')} noValidate onSubmit={onSubmit}>
          <label className={`form-field ${hasError ? 'error' : ''}`}>
            <span className="form-label">
              {t('auth.username')} <span className="required" aria-hidden="true">*</span>
            </span>
            <input
              type="text"
              name="username"
              placeholder={t('auth.enterUsername')}
              autoComplete="username"
              value={username}
              onChange={(event) => onUsernameChange(event.target.value)}
              aria-invalid={hasError}
              required
            />
          </label>

          <label className={`form-field ${hasError ? 'error' : ''}`}>
            <span className="form-label">
              {t('auth.password')} <span className="required" aria-hidden="true">*</span>
            </span>
            <div className="password-field">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                name="password"
                placeholder={t('auth.enterPassword')}
                autoComplete="current-password"
                value={password}
                onChange={(event) => onPasswordChange(event.target.value)}
                aria-invalid={hasError}
                required
              />
              <button
                type="button"
                className={`password-toggle ${isPasswordVisible ? 'password-toggle--active' : ''}`}
                aria-label={isPasswordVisible ? t('auth.hidePassword') : t('auth.showPassword')}
                onClick={onTogglePasswordVisibility}
              >
                <span className="toggle-dot" />
              </button>
            </div>
          </label>

          <div className="form-options">
            <label className="remember">
              <span className="checkbox" aria-hidden="true">
                <img src={CHECK_ICON} alt="" />
              </span>
              <span>{t('auth.rememberMe')}</span>
            </label>
            <a className="forgot-link" href="#" onClick={(e) => { e.preventDefault(); onForgotPasswordClick(); }}>
              {t('auth.forgotPassword')}
        </a>
      </div>

          {hasError && (
            <p className="form-error" role="alert">
              {errorMessage}
            </p>
          )}

          <div className="action-buttons">
            <button type="submit" className="btn btn-primary">
              {t('auth.signIn')}
        </button>
            <button type="button" className="btn btn-secondary" onClick={onSignUp}>
              {t('auth.signUp')}
            </button>
          </div>
        </form>
          </>
        )}
      </main>

      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

type ForgotPasswordOTPScreenProps = {
  phoneNumber: string
  otpCode: string[]
  otpTimer: number
  errorMessage: string
  onOtpChange: (index: number, value: string) => void
  onBack: () => void
  onResendOtp: () => void
  onContinue: () => void
}

function ForgotPasswordOTPScreen({
  phoneNumber,
  otpCode,
  otpTimer,
  errorMessage,
  onOtpChange,
  onBack,
  onResendOtp,
  onContinue,
}: ForgotPasswordOTPScreenProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const formatPhoneNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '')
    if (digitsOnly.length >= 10) {
      const area = digitsOnly.slice(0, 3)
      const middle = digitsOnly.slice(3, 6)
      const last = digitsOnly.slice(6, 10)
      return `${area}-${middle}-${last}`
    }
    return value
  }

  const displayPhoneNumber = phoneNumber ? formatPhoneNumber(phoneNumber) : 'your phone number'
  const isResendDisabled = otpTimer > 0
  const canContinue = otpCode.every((digit) => digit.trim() !== '')

  const handleChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value.replace(/\D/g, '')
    const value = raw.slice(-1)
    onOtpChange(index, value)
    if (value && index < otpCode.length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
    if ((event.key === 'Backspace' || event.key === 'Delete') && !otpCode[index] && index > 0) {
      onOtpChange(index - 1, '')
      inputRefs.current[index - 1]?.focus()
      event.preventDefault()
    }
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '')
    if (!pasted) {
      return
    }

    for (let i = 0; i < otpCode.length && i < pasted.length; i += 1) {
      onOtpChange(i, pasted[i])
    }

    const nextIndex = Math.min(pasted.length, otpCode.length - 1)
    inputRefs.current[nextIndex]?.focus()
    event.preventDefault()
  }

  return (
    <div className="signin-screen forgot-otp-screen" role="presentation">
      <div className="status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>

      <section className="hero hero--otp" aria-hidden="true">
        <div className="hero-background">
          <div className="hero-overlay" />
        </div>
        <div className="hero-grid" />
        <div className="hero-phone">
          <div className="hero-phone-body">
            <div className="hero-phone-screen">
              <img src={CITY_IMAGE} alt="City skyline reflection" loading="lazy" />
            </div>
          </div>
        </div>
        <img className="hero-truck" src={TRUCK_IMAGE} alt="Green delivery truck" loading="lazy" />
        <img className="hero-pin" src={MAP_PIN_IMAGE} alt="Delivery location pin" loading="lazy" />
        <div className="hero-brand">
          <div className="brand-top">
            <span className="brand-icon" aria-hidden="true" />
            <span className="brand-the">The</span>
          </div>
          <span className="brand-truckers">Truckers</span>
        </div>
      </section>

      <main className="form-card forgot-otp-card" aria-label="Forgot password OTP verification">
        <button type="button" className="forgot-otp-back" onClick={onBack}>
          ← Back
        </button>

        <h1>Verify your phone</h1>
        <p className="forgot-otp-subtitle">
          Enter the 6-digit OTP we sent to <strong>{displayPhoneNumber}</strong>.
        </p>

        <div className="forgot-otp-inputs">
          {otpCode.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="forgot-otp-input"
              value={digit}
              onChange={handleChange(index)}
              onKeyDown={handleKeyDown(index)}
              onPaste={index === 0 ? handlePaste : undefined}
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>

        {errorMessage && (
          <p className="form-error forgot-otp-error" role="alert">
            {errorMessage}
          </p>
        )}

        <button type="button" className="btn btn-primary forgot-otp-submit" onClick={onContinue} disabled={!canContinue}>
          Confirm OTP
        </button>

        <button type="button" className="forgot-otp-resend" onClick={onResendOtp} disabled={isResendDisabled}>
          Resend code {isResendDisabled ? `(${otpTimer}s)` : ''}
        </button>
      </main>

      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

type ForgotPasswordResetScreenProps = {
  onPasswordReset: (password: string) => void
  onLogin: () => void
}

function ForgotPasswordResetScreen({ onPasswordReset, onLogin }: ForgotPasswordResetScreenProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [pendingPassword, setPendingPassword] = useState('')

  const passwordRules = [
    {
      id: 'length',
      label: 'Minimum of 8 characters',
      isMet: password.length >= 8,
    },
    {
      id: 'case',
      label: 'Use uppercase and lowercase letters (A-Z, a-z)',
      isMet: /[A-Z]/.test(password) && /[a-z]/.test(password),
    },
    {
      id: 'number',
      label: 'Include at least one number (0-9)',
      isMet: /\d/.test(password),
    },
    {
      id: 'special',
      label: 'Add at least one special character',
      isMet: /[^A-Za-z0-9]/.test(password),
    },
  ]

  const allRulesMet = passwordRules.every((rule) => rule.isMet)
  const passwordsMatch = confirmPassword.length > 0 ? password === confirmPassword : false
  const canSubmit = allRulesMet && passwordsMatch

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) {
      return
    }
    setPendingPassword(password)
    setShowSuccessModal(true)
  }

  const handleSuccessAction = (action: 'home' | 'start') => {
    if (!pendingPassword) {
      return
    }

    onPasswordReset(pendingPassword)
    if (action === 'start') {
      onLogin()
    }

    setShowSuccessModal(false)
    setPendingPassword('')
    setPassword('')
    setConfirmPassword('')
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  return (
    <div className="signin-screen forgot-reset-screen" role="presentation">
      <div className="status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>

      <section className="hero hero--otp" aria-hidden="true">
        <div className="hero-background">
          <div className="hero-overlay" />
        </div>
        <div className="hero-grid" />
        <div className="hero-phone">
          <div className="hero-phone-body">
            <div className="hero-phone-screen">
              <img src={CITY_IMAGE} alt="City skyline reflection" loading="lazy" />
            </div>
          </div>
        </div>
        <img className="hero-truck" src={TRUCK_IMAGE} alt="Green delivery truck" loading="lazy" />
        <img className="hero-pin" src={MAP_PIN_IMAGE} alt="Delivery location pin" loading="lazy" />
        <div className="hero-brand">
          <div className="brand-top">
            <span className="brand-icon" aria-hidden="true" />
            <span className="brand-the">The</span>
          </div>
          <span className="brand-truckers">Truckers</span>
        </div>
      </section>

      <main className="form-card forgot-reset-card">
        <div className="forgot-reset-heading">
          <h1>Create a new password</h1>
          <p>For your security, choose a password that meets all requirements.</p>
        </div>

        <form className="form forgot-reset-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span className="form-label">
              New password <span className="required" aria-hidden="true">*</span>
            </span>
            <div className={`password-field ${allRulesMet ? 'password-field--valid' : ''}`}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="new-password"
                placeholder="Enter new password"
                value={password}
                autoComplete="new-password"
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className={`password-toggle ${showPassword ? 'password-toggle--active' : ''}`}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <span className="toggle-dot" />
              </button>
            </div>

            <ul className="forgot-reset-rules" aria-live="polite">
              {passwordRules.map((rule) => (
                <li key={rule.id} className={`forgot-reset-rule ${rule.isMet ? 'forgot-reset-rule--met' : ''}`}>
                  <span className="forgot-reset-rule-icon" aria-hidden="true" />
                  {rule.label}
                </li>
              ))}
            </ul>
          </label>

          <label className={`form-field ${confirmPassword && !passwordsMatch ? 'error' : ''}`}>
            <span className="form-label">
              Confirm password <span className="required" aria-hidden="true">*</span>
            </span>
            <div className="password-field">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirm-password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                autoComplete="new-password"
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className={`password-toggle ${showConfirmPassword ? 'password-toggle--active' : ''}`}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                <span className="toggle-dot" />
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="forgot-reset-mismatch" role="alert">
                Passwords must match.
              </p>
            )}
          </label>

          <div className="forgot-reset-actions">
            <button type="submit" className="btn btn-primary forgot-reset-submit" disabled={!canSubmit}>
              Create new password
            </button>
            <button type="button" className="btn btn-secondary forgot-reset-login" onClick={onLogin}>
              Log in
            </button>
          </div>
        </form>
      </main>

      {showSuccessModal && (
        <div className="forgot-reset-success-overlay" role="presentation">
          <div
            className="forgot-reset-success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="forgot-reset-success-title"
            aria-describedby="forgot-reset-success-description"
          >
            <div className="forgot-reset-success-icon" aria-hidden="true">
              <span className="forgot-reset-success-check" />
            </div>
            <div className="forgot-reset-success-text">
              <h2 id="forgot-reset-success-title">Password reset successful!</h2>
              <p id="forgot-reset-success-description">You can now sign in with your new password.</p>
            </div>
            <div className="forgot-reset-success-actions">
              <button type="button" className="forgot-reset-success-btn" onClick={() => handleSuccessAction('home')}>
                Home
              </button>
              <button
                type="button"
                className="forgot-reset-success-btn forgot-reset-success-btn--primary"
                onClick={() => handleSuccessAction('start')}
              >
                Start using
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

type TermsScreenProps = {
  onBack: () => void
  onContinue: () => void
}

function TermsScreen({ onBack, onContinue }: TermsScreenProps) {
  const [hasReachedBottom, setHasReachedBottom] = useState(false)
  const [showPrompt, setShowPrompt] = useState(true)

  useEffect(() => {
    if (hasReachedBottom) {
      setShowPrompt(false)
    }
  }, [hasReachedBottom])

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget
    const reachedBottom = Math.ceil(element.scrollTop + element.clientHeight) >= element.scrollHeight
    if (reachedBottom) {
      setHasReachedBottom(true)
    }
  }

  return (
    <div className="terms-screen" role="presentation">
      <div className="status-bar status-bar--inverse terms-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>

      <div className="terms-header">
        <button type="button" className="terms-close" onClick={onBack} aria-label="Close terms and return to sign in">
          <img src={TERMS_CLOSE_ICON} alt="" />
        </button>
        <div className="terms-heading">
          <h2>Terms of Service & Policy</h2>
          <p className="terms-subtitle">Truckers Driver Privacy Policy</p>
          <p className="terms-effective">Effective January 15, 2024</p>
        </div>
      </div>

      <div className="terms-content" aria-label="Terms of service details" onScroll={handleScroll}>
        <section>
          <h3>Information We Collect</h3>
          <p>
            We collect details that help us operate the Truckers platform safely and efficiently for our drivers. This includes what you share
            directly along with insights gathered from app usage:
          </p>
          <ul>
            <li>Personal details such as your name, email, phone number, and service account information.</li>
            <li>Trip insights including GPS routes, speed, pickup and drop-off timestamps, and route preferences.</li>
            <li>Vehicle information such as license plate numbers, vehicle type, and maintenance indicators.</li>
            <li>Payment information required to send or receive payouts securely.</li>
            <li>Communication logs related to customer support and in-app messaging.</li>
          </ul>
        </section>
        <section>
          <h3>How We Use Your Information</h3>
          <p>Data enables us to deliver a consistent experience and to honor contractual and legal obligations. Typical uses include:</p>
          <ul>
            <li>Coordinating freight assignments and tracking delivery milestones.</li>
            <li>Processing payments and generating invoices.</li>
            <li>Improving the app experience through analytics and performance monitoring.</li>
            <li>Keeping you informed about trip status, alerts, and safety notices.</li>
            <li>Complying with transportation and financial regulations.</li>
          </ul>
        </section>
        <section>
          <h3>When We Share Information</h3>
          <p>
            We share personal information only when necessary and with safeguards in place. This may include vetted vendors supporting payments or
            analytics, regulatory authorities when required, or anonymized data sets that cannot identify you personally.
          </p>
        </section>
      </div>

      {showPrompt && (
        <div className="terms-prompt">
          <p>{hasReachedBottom ? 'You can continue now.' : 'Scroll to the bottom to continue.'}</p>
          <button
            type="button"
            className="terms-prompt-action"
            onClick={() => setShowPrompt(false)}
            aria-label="Dismiss prompt"
          >
            OK
          </button>
        </div>
      )}

      <div className="terms-footer">
        <button
          type="button"
          className={`btn terms-accept ${hasReachedBottom ? 'terms-accept--enabled' : ''}`}
          onClick={() => hasReachedBottom && onContinue()}
          disabled={!hasReachedBottom}
        >
          Accept
        </button>
      </div>

      <div className="home-indicator home-indicator--raised" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

type PolicyScreenProps = {
  onBack: () => void
  onFinish: () => void
}

function PolicyScreen({ onBack, onFinish }: PolicyScreenProps) {
  return (
    <div className="policy-screen" role="presentation">
      <div className="status-bar status-bar--inverse" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>

      <div className="policy-header">
        <button type="button" className="policy-close" onClick={onBack} aria-label="Back to previous terms">
          <img src={POLICY_CLOSE_ICON} alt="" />
        </button>
        <div className="policy-heading">
          <h2>Terms of Service & Policy</h2>
        </div>
      </div>

      <div className="policy-content" aria-label="Driver privacy policy details">
        <section>
          <h3>Truckers Driver Privacy Policy</h3>
          <p className="policy-effective">Effective January 15, 2024</p>
          <p>
            We only collect the information required to onboard and support drivers on Truckers. This includes what you share with us as well as
            operational information captured automatically when you drive.
          </p>
          <ul>
            <li>Account information such as name, email, phone number, and company identifiers.</li>
            <li>Trip and vehicle data including GPS traces, vehicle type, plate numbers, and maintenance signals.</li>
            <li>Financial details required for secure disbursements.</li>
            <li>Customer support interactions and safety communications.</li>
          </ul>
        </section>
        <section>
          <h3>How We Use This Information</h3>
          <ul>
            <li>Match you with shipments and streamline pickup and drop-off workflows.</li>
            <li>Handle payouts, billing, and compliance reporting.</li>
            <li>Enhance route recommendations and driver experience.</li>
            <li>Deliver safety alerts, status updates, and incident notifications.</li>
            <li>Meet regulatory and contractual obligations.</li>
          </ul>
        </section>
        <section>
          <h3>Sharing and Safeguards</h3>
          <p>
            We never sell personal data. Information is shared only with vetted service providers bound by confidentiality agreements, regulatory
            agencies when mandated, or in anonymized form for analytics.
          </p>
        </section>
      </div>

      <div className="policy-footer">
        <button type="button" className="btn policy-accept" onClick={onFinish}>
          Accept
        </button>
      </div>

      <div className="home-indicator home-indicator--raised" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

type InfoScreenProps = {
  onBack: () => void
  onContinue: () => void
  data: InfoFormData
  onChange: (field: keyof InfoFormData, value: string) => void
  avatarPreview: string | null
  onAvatarSelect: (file: File | null) => void
}

type TruckScreenProps = {
  onBack: () => void
  onFinish: () => void
  images: typeof INITIAL_TRUCK_IMAGES
  onImageSelect: (key: keyof typeof INITIAL_TRUCK_IMAGES, file: File | null) => void
  hasTrailer: boolean
  onToggleTrailer: (value: boolean) => void
}

type VehicleInfoScreenProps = {
  onBack: () => void
  onContinue: () => void
  data: VehicleFormData
  onChange: (field: keyof VehicleFormData, value: string) => void
  trailerOptions: TrailerOptions
  onTrailerOptionChange: (option: keyof TrailerOptions) => (value: boolean) => void
  vehicleDocs: typeof INITIAL_VEHICLE_DOCS
  onDocSelect: (key: keyof typeof INITIAL_VEHICLE_DOCS, file: File | null) => void
}

type ReviewScreenProps = {
  onBack: (view: View) => void
  onSubmit: () => void
  infoData: InfoFormData
  avatarPreview: string | null
  truckImages: typeof INITIAL_TRUCK_IMAGES
  hasTrailer: boolean
  vehicleData: VehicleFormData
  trailerOptions: TrailerOptions
  vehicleDocs: typeof INITIAL_VEHICLE_DOCS
}

type VerificationScreenProps = {
  onBack: () => void
  onVerified: () => void
}

type AccountPasswordOTPScreenProps = {
  onBack: () => void
  onVerified: () => void
}

type BottomNavTab = 'home' | 'control' | 'chat' | 'settings' | 'shipping'
type BottomNavItemConfig = { key: BottomNavTab; label: string; icon: string }
type HomeShortcutConfig = { id: string; label: string; icon: string; onClick: () => void }

type HomeScreenProps = {
  jobs: RecommendedJob[]
  onAcceptJob: (jobId: string) => void
  onOpenCurrentJobs: () => void
  onOpenFinancial: () => void
  onOpenShipping: () => void
  onOpenCustomers: () => void
  onOpenJobHistory: () => void
  onOpenBids: () => void
  onOpenProducts: () => void
  onOpenSearch: () => void
  onSelectTab: (tab: BottomNavTab) => void
  customShortcuts?: HomeShortcutConfig[]
  bottomNavItems?: BottomNavItemConfig[]
}

type CompanyHomeScreenProps = {
  displayName: string
  onOpenCurrentJobs: () => void
  onOpenFinancial: () => void
  onOpenCustomers: () => void
  onOpenJobHistory: () => void
  onOpenBids: () => void
  onSelectTab: (tab: BottomNavTab) => void
}

type CustomerHomeScreenProps = {
  jobs: RecommendedJob[]
  onAcceptJob: (jobId: string) => void
  onOpenCurrentJobs: () => void
  onOpenFinancial: () => void
  onOpenShipping: () => void
  onOpenCustomers: () => void
  onOpenJobHistory: () => void
  onOpenBids: () => void
  onOpenProducts: () => void
  onOpenSearch: () => void
  onSelectTab: (tab: BottomNavTab) => void
}

type ShippingHomeScreenProps = {
  displayName: string
  onOpenFinancial: () => void
  onOpenBids: () => void
  onOpenShipping: () => void
  onOpenCustomers: () => void
  onOpenProducts: () => void
  onOpenVehicleInformation: () => void
  onSelectTab: (tab: BottomNavTab) => void
  onLogout: () => void
}

type ShippingFinanceScreenProps = {
  onBack: () => void
}

type JobHistoryScreenProps = {
  onBack: () => void
  onOpenJob: (jobId: string) => void
}

type ControlScreenProps = {
  onOpenFinancial: () => void
  onOpenShipping: () => void
  onOpenCustomers: () => void
  onOpenProducts: () => void
  onSelectTab: (tab: BottomNavTab) => void
}

type ChatScreenProps = {
  onSelectTab: (tab: BottomNavTab) => void
  userRole?: string
}

type ChatCategory = 'companies' | 'friends' | 'groups'

type ChatThread = {
  id: string
  name: string
  initials: string
  color: string
  lastMessage: string
  time: string
  unread?: number
  online?: boolean
}

type BottomNavProps = {
  active: BottomNavTab
  onSelect: (tab: BottomNavTab) => void
  items?: BottomNavItemConfig[]
}

type RecommendedJobDetailRow = {
  label: string
  value: string
}

type RecommendedJobSection = {
  rows: RecommendedJobDetailRow[]
}

type RecommendedJob = {
  id: string
  codeLabel: string
  date: string
  time: string
  employer: string
  jobType: string
  price: string
  direction: 'inbound' | 'outbound'
  category: 'domestic' | 'international'
  route: {
    origin: string
    destination: string
    stopsNote?: string
  }
  sections: RecommendedJobSection[]
  startDate?: string
  startTime?: string
}

type CurrentJobDetailAction = {
  key: 'call' | 'route' | 'status' | 'pay' | 'info'
  label: string
}

type CurrentJobDetailPaymentInfo = {
  method: string
  amount: string
  timestamp?: string
}

type JobHistoryTab = 'all' | 'inTransit' | 'completed'

type JobHistoryChip = {
  icon?: string
  text: string
  secondaryText?: string
  variant?: 'accent' | 'default'
}

type JobHistoryEntry = {
  id: string
  headerLabel: string
  dateLabel: string
  timeLabel: string
  originLabel: string
  destinationLabel: string
  chips: JobHistoryChip[]
  status: { key: 'inTransit' | 'completed'; label: string }
  summaryRows?: Array<{ label: string; value: string }>
  jobType?: string
  stopsLabel?: string
  infoBlocks?: Array<{ label: string; value: string }>
  jobDetailId?: string
}

type JobHistoryMonth = {
  month: string
  entries: JobHistoryEntry[]
}

type CurrentJobDetailStop = {
  id: string
  title: string
  badge?: { label: string; tone: 'warning' | 'success' }
  contactName: string
  contactRole?: string
  routeCode: string
  cargo: string
  scheduleLabel: string
  scheduleValue: string
  note?: string
  isHighlighted?: boolean
  actions: CurrentJobDetailAction[]
  address?: string
  mapImage?: string
  productDescription?: string
  checkInLabel?: string
  checkInValue?: string
  checkInCta?: string
  postCheckInCta?: string
  postCheckInIcon?: string
  paymentInfo?: CurrentJobDetailPaymentInfo
  podTimestamp?: string
}

type CurrentJobDetail = {
  id: string
  code: string
  price: string
  stopCount: string
  cargoTotal: string
  customer: string
  issueLabel: string
  stops: CurrentJobDetailStop[]
  footerCta: string
}

const RECOMMENDED_JOBS: RecommendedJob[] = [
  {
    id: 'job-1',
    codeLabel: 'Order ID TRK-2024-001',
    date: '29 Feb 21',
    time: '10:00',
    employer: 'IdeaPlus Public Co., Ltd.',
    jobType: 'International single-trip inbound shipment',
    price: '฿ 5,000',
    direction: 'inbound',
    category: 'international',
    route: {
      origin: 'Vientiane Logistics Hub, Laos',
      destination: 'Laem Chabang Port warehouse, Chonburi, Thailand',
    },
    startDate: '15/8/2025',
    startTime: '10:00',
    sections: [
      {
        rows: [
          { label: 'Vehicle equipment', value: 'Onboard gear: tarp, trolley, sealed crates' },
          { label: 'Safety equipment', value: '-' },
        ],
      },
    ],
  },
  {
    id: 'job-2',
    codeLabel: 'Order ID TRK-2024-002',
    date: '29 Feb 21',
    time: '12:00',
    employer: 'Thai PM Charter Co., Ltd.',
    jobType: 'Domestic multi-stop delivery',
    price: '฿ 3,000',
    direction: 'outbound',
    category: 'domestic',
    route: {
      origin: 'ThaiKen Kabin depot',
      destination: 'XYZ Department Store',
      stopsNote: '2 stops',
    },
    startDate: '15/8/2025',
    startTime: '12:00',
    sections: [
      {
        rows: [
          { label: 'Cargo type', value: 'Sugar (30 crates)' },
          { label: 'Vehicle equipment', value: 'Onboard gear: tarp, trolley, sealed crates' },
          { label: 'Safety equipment', value: '-' },
        ],
      },
    ],
  },
  {
    id: 'job-3',
    codeLabel: 'Order ID TRK-2024-003',
    date: '29 Feb 64',
    time: '10:00',
    employer: 'IdeaPlus Public Co., Ltd.',
    jobType: 'International single-trip inbound shipment',
    price: '฿ 5,000',
    direction: 'inbound',
    category: 'international',
    route: {
      origin: 'Ho Chi Minh Port, Vietnam',
      destination: 'Bangkok Inland Container Depot, Thailand',
    },
    startDate: '29/2/2024',
    startTime: '10:00',
    sections: [
      {
        rows: [
          { label: 'Vehicle equipment', value: 'Onboard gear: tarp, trolley, sealed crates' },
          { label: 'Safety equipment', value: '-' },
        ],
      },
    ],
  },
]

const CURRENT_JOB_DETAILS: Record<string, CurrentJobDetail> = {
  'job-1': {
    id: 'job-1',
    code: 'TRK-2024-001',
    price: '฿ 5,000',
    stopCount: 'Stops: 3',
    cargoTotal: 'Cargo: 12 pallets',
    customer: 'IdeaPlus Public Co., Ltd.',
    issueLabel: 'Report issue',
    footerCta: 'Start job',
    stops: [
      {
        id: 'job-1-pickup',
        title: 'Pickup • Bangkok Distribution Center',
        badge: { label: 'On schedule', tone: 'success' },
        contactName: 'Khun Supaporn',
        contactRole: 'Warehouse supervisor',
        routeCode: 'BKK001 · Lat Krabang / Bangkok',
        cargo: 'Frozen seafood (12 pallets)',
        scheduleLabel: 'Pick-up time',
        scheduleValue: '15/08/2025 · 09:00',
        note: 'Enter through gate 4 and call security on arrival.',
        isHighlighted: true,
        actions: [
          { key: 'call', label: 'Call' },
          { key: 'route', label: 'Route' },
          { key: 'info', label: 'View info' },
          { key: 'status', label: 'Update status' },
        ],
        address: 'Bangkok Distribution Center, Lat Krabang, Bangkok',
        mapImage: CURRENT_JOBS_MAP_IMAGE,
        productDescription: 'Frozen seafood (12 pallets)',
        checkInLabel: 'Check-in time',
        checkInValue: '15/08/2025 · 09:00',
        checkInCta: 'Check in',
      },
      {
        id: 'job-1-dropoff',
        title: 'Drop-off • Chiang Mai North DC',
        contactName: 'Khun Orn',
        contactRole: 'Receiving lead',
        routeCode: 'CMN002 · Chiang Mai North',
        cargo: 'Frozen seafood (12 pallets)',
        scheduleLabel: 'Drop-off time',
        scheduleValue: '15/08/2025 · 15:35',
        note: 'Dock 6 · verify temperature logs with receiving team.',
        address: 'Chiang Mai North Distribution Center, Chiang Mai',
        mapImage: CURRENT_JOBS_MAP_IMAGE,
        actions: [
          { key: 'call', label: 'Call' },
          { key: 'route', label: 'Route' },
          { key: 'info', label: 'View info' },
        ],
        checkInCta: 'Check in',
        postCheckInCta: 'Pay',
        postCheckInIcon: CURRENT_JOBS_PRICE_ICON,
        paymentInfo: {
          method: 'On delivery',
          amount: '฿ 5,000',
          timestamp: '15/08/2025 | 12.30',
        },
        podTimestamp: '15/08/2025 · 13:00',
      },
    ],
  },
  'job-2': {
    id: 'job-2',
    code: 'TRK-2024-002',
    price: '฿ 3,000',
    stopCount: 'Stops: 4',
    cargoTotal: 'Cargo: 60 crates',
    customer: 'Thai PM Charter Co., Ltd.',
    issueLabel: 'Report issue',
    footerCta: 'Start job',
    stops: [
      {
        id: 'job-2-pickup',
        title: 'Pickup • Factory 1',
        badge: { label: 'Waiting', tone: 'warning' },
        contactName: 'Khun Suphawat',
        contactRole: 'Warehouse manager',
        routeCode: 'BKK001 · Lat Krabang / Bangkok',
        cargo: 'Sugar (30 crates)',
        scheduleLabel: 'Pick-up time',
        scheduleValue: '15/08/2025 · 09:00',
        note: 'Show ID badge at gate before entry.',
        isHighlighted: true,
        actions: [
          { key: 'call', label: 'Call' },
          { key: 'route', label: 'Route' },
          { key: 'info', label: 'View info' },
          { key: 'status', label: 'Update status' },
        ],
        address: '55/5 Soi Lat Phrao 101, Khlong Chan, Bangkok',
        mapImage: CURRENT_JOBS_MAP_IMAGE,
        productDescription: 'Sugar (30 crates)',
        checkInLabel: 'Check-in time',
        checkInValue: '15/08/2025 · 09:00',
        checkInCta: 'Check in',
      },
      {
        id: 'job-2-dropoff',
        title: 'Drop-off • Chai Sugar Co.',
        badge: { label: 'Awaiting confirmation', tone: 'warning' },
        contactName: 'Khun Thongchai',
        contactRole: 'Receiving supervisor',
        routeCode: 'SAM001 · Mueang / Samut Prakan',
        cargo: 'Sugar (30 crates)',
        scheduleLabel: 'Drop-off time',
        scheduleValue: '15/08/2025 | 12.30',
        note: 'Confirm delivery docket with front office.',
        address: '25/7 Bang Phli Yai, Mueang Samut Prakan, Samut Prakan',
        mapImage: CURRENT_JOBS_MAP_IMAGE,
        actions: [
          { key: 'call', label: 'Call' },
          { key: 'route', label: 'Route' },
          { key: 'info', label: 'View info' },
        ],
        checkInCta: 'Check in',
        checkInValue: '15/08/2025 | 12.00',
        postCheckInCta: 'Pay',
        postCheckInIcon: CURRENT_JOBS_PRICE_ICON,
        paymentInfo: {
          method: 'Collect on delivery',
          amount: '฿ 1,000',
          timestamp: '15/08/2025 | 12.30',
        },
        podTimestamp: '15/08/2025 · 13:00',
      },
    ],
  },
}


type StepIndicatorProps = {
  current: number
  total: number
}

type ImageDropzoneProps = {
  id: string
  label: string
  helper: string
  required?: boolean
  value: string | null
  onChange: (file: File | null) => void
}

function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <div className="step-indicator">
      {Array.from({ length: total }).map((_, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber <= current
        return <span key={stepNumber} className={`step-indicator__segment ${isActive ? 'step-indicator__segment--active' : ''}`} />
      })}
    </div>
  )
}

function ImageDropzone({ id, label, helper, required = false, value, onChange }: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const labelId = `${id}-label`

  const openPicker = () => {
    inputRef.current?.click()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openPicker()
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    onChange(file)
    event.target.value = ''
  }

  return (
    <div className="truck-field">
      <p id={labelId} className="truck-field-label">
        {label} {required && <span className="required">*</span>}
      </p>
      <div
        className={`truck-dropzone ${value ? 'truck-dropzone--filled' : ''}`}
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={handleKeyDown}
        aria-labelledby={labelId}
      >
        <span className="truck-dropzone-icon" aria-hidden="true" />
        {value ? (
          <img src={value} alt={`${label} preview`} className="truck-dropzone-preview" />
        ) : (
          <p className="truck-dropzone-text">{helper}</p>
        )}
      </div>
      <input ref={inputRef} id={id} type="file" accept="image/*" className="sr-only" onChange={handleChange} />
    </div>
  )
}

function InfoScreen({ onBack, onContinue, data, onChange, avatarPreview, onAvatarSelect }: InfoScreenProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    avatarInputRef.current?.click()
  }

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    onAvatarSelect(file)
    event.target.value = ''
  }

  const handleFieldChange = (field: keyof InfoFormData) => (event: ChangeEvent<HTMLInputElement>) => {
    onChange(field, event.target.value)
  }

  return (
    <div className="info-screen" role="presentation">
      <div className="status-bar status-bar--inverse info-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>

      <header className="info-header">
        <button type="button" className="info-back" onClick={onBack} aria-label="Back to policy">
          <span />
        </button>
        <h2>General Information</h2>
      </header>

      <StepIndicator current={2} total={5} />

      <main className="info-content">
        <section className="info-avatar">
          <div className="avatar-ring">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Driver profile preview" className="avatar-preview" />
            ) : (
              <div className="avatar-icon" aria-hidden="true">
                <div className="avatar-head" />
                <div className="avatar-body" />
              </div>
            )}
          </div>
          <button type="button" className="avatar-upload" onClick={handleAvatarClick} aria-label="Upload driver photo">
            <span className="avatar-camera" />
          </button>
          <p>Tap to take or choose a profile photo</p>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleAvatarChange}
          />
        </section>

        <section className="info-section">
          <h3>Personal Details</h3>
          <div className="info-field">
            <label htmlFor="firstName">
              First Name <span className="required">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              placeholder="Match your government ID"
              value={data.firstName}
              onChange={handleFieldChange('firstName')}
            />
          </div>
          <div className="info-field">
            <label htmlFor="lastName">
              Last Name <span className="required">*</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              placeholder="Match your government ID"
              value={data.lastName}
              onChange={handleFieldChange('lastName')}
            />
          </div>
          <div className="info-field">
            <label htmlFor="phone">
              Phone Number <span className="required">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              placeholder="+66 000 000 000"
              value={data.phone}
              onChange={handleFieldChange('phone')}
            />
          </div>
          <div className="info-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              placeholder="name@company.com"
              type="email"
              value={data.email}
              onChange={handleFieldChange('email')}
            />
          </div>
        </section>

        <section className="info-section">
          <h3>Account Access</h3>
          <div className="info-field">
            <label htmlFor="accountUsername">
              Username <span className="required">*</span>
            </label>
            <input
              id="accountUsername"
              name="accountUsername"
              placeholder="Create a username"
              value={data.username}
              onChange={handleFieldChange('username')}
            />
          </div>
          <div className="info-field info-field--split">
            <div>
              <label htmlFor="accountPassword">
                Password <span className="required">*</span>
              </label>
              <input id="accountPassword" name="accountPassword" type="password" placeholder="Create a password" />
            </div>
            <div>
              <label htmlFor="confirmPassword">
                Confirm Password <span className="required">*</span>
              </label>
              <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Re-enter password" />
            </div>
          </div>
        </section>

        <section className="info-section">
          <h3>Operating Preference</h3>
          <div className="info-field">
            <label htmlFor="region">
              Province / Operating Area <span className="required">*</span>
            </label>
            <div className="info-select">
              <input
                id="region"
                name="region"
                placeholder="Select province"
                value={data.region}
                onChange={handleFieldChange('region')}
              />
            </div>
          </div>
          <div className="info-field info-field--split">
            <div>
              <label htmlFor="rateMin">Daily Rate (฿) From</label>
              <input
                id="rateMin"
                name="rateMin"
                placeholder="0"
                value={data.rateMin}
                onChange={handleFieldChange('rateMin')}
              />
            </div>
            <div>
              <label htmlFor="rateMax">To</label>
              <input
                id="rateMax"
                name="rateMax"
                placeholder="0"
                value={data.rateMax}
                onChange={handleFieldChange('rateMax')}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="info-footer">
        <button type="button" className="btn info-continue" onClick={onContinue}>
          Continue
        </button>
      </footer>

      <div className="home-indicator home-indicator--raised" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

function TruckScreen({ onBack, onFinish, images, onImageSelect, hasTrailer, onToggleTrailer }: TruckScreenProps) {
  const handleSelect =
    (key: keyof typeof INITIAL_TRUCK_IMAGES) =>
    (file: File | null) => {
      onImageSelect(key, file)
    }

  return (
    <div className="truck-screen" role="presentation">
      <div className="status-bar status-bar--inverse truck-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>

      <header className="truck-header">
        <button type="button" className="info-back" onClick={onBack} aria-label="Back to general information">
          <span />
        </button>
        <h2>Upload Truck Photos</h2>
      </header>

      <StepIndicator current={3} total={5} />

      <main className="truck-content">
        <ImageDropzone
          id="truck-front"
          label="Front of Truck"
          helper={'Tap to capture or upload\nfront view'}
          required
          value={images.front}
          onChange={handleSelect('front')}
        />
        <ImageDropzone
          id="truck-side"
          label="Side of Truck"
          helper={'Tap to capture or upload\nside view'}
          required
          value={images.side}
          onChange={handleSelect('side')}
        />
        <ImageDropzone
          id="truck-rear"
          label="Rear of Truck"
          helper={'Tap to capture or upload\nrear view'}
          required
          value={images.rear}
          onChange={handleSelect('rear')}
        />
        <ImageDropzone
          id="truck-plate"
          label="License Plate"
          helper={'Tap to capture or upload\nplate photo'}
          required
          value={images.plate}
          onChange={handleSelect('plate')}
        />

        <div className="truck-checkbox">
          <input
            id="hasTrailer"
            type="checkbox"
            checked={hasTrailer}
            onChange={(event) => onToggleTrailer(event.target.checked)}
          />
          <label htmlFor="hasTrailer">Includes trailer</label>
        </div>

        {hasTrailer && (
          <ImageDropzone
            id="truck-trailer"
            label="Trailer License Plate"
            helper={'Tap to capture or upload\ntrailer plate'}
            required
            value={images.trailer}
            onChange={handleSelect('trailer')}
          />
        )}
      </main>

      <footer className="truck-footer">
        <button type="button" className="btn truck-continue" onClick={onFinish}>
          Continue
        </button>
      </footer>

      <div className="home-indicator home-indicator--raised" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

function BottomNav({ active, onSelect, items }: BottomNavProps) {
  const { t } = useTranslation()
  
  const defaultItems: BottomNavItemConfig[] = [
    { key: 'home', label: t('navigation.home'), icon: HOME_NAV_HOME_ICON },
    { key: 'control', label: t('navigation.control'), icon: HOME_NAV_CONTROL_ICON },
    { key: 'chat', label: t('navigation.chat'), icon: HOME_NAV_CHAT_ICON },
    { key: 'settings', label: t('navigation.settings'), icon: HOME_NAV_SETTINGS_ICON },
  ]

  const navItems = items ?? defaultItems

  return (
    <nav className="home-bottom-nav" aria-label="Primary navigation">
      {navItems.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`home-bottom-nav__item${active === item.key ? ' home-bottom-nav__item--active' : ''}`}
          onClick={() => onSelect(item.key)}
        >
          <span className="home-bottom-nav__icon" aria-hidden="true">
            <img src={item.icon} alt="" />
          </span>
          <span className="home-bottom-nav__label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

type HomeSearchScreenProps = {
  jobs: RecommendedJob[]
  onBack: () => void
  onAcceptJob: (jobId: string) => void
}

type FilterState = {
  transportType: string
  province: string
  district: string
  minPrice: string
  maxPrice: string
}

function HomeSearchScreen({ jobs: availableJobs, onBack, onAcceptJob }: HomeSearchScreenProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    transportType: '',
    province: '',
    district: '',
    minPrice: '',
    maxPrice: '',
  })
  const recentSearches = ['Bangkok', 'Airport']
  const popularSearches = ['Bangkok Metropolis', 'Warehouse', 'Mall', 'CP']

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Search is handled automatically via searchTerm state
  }

  const handleClearSearch = () => {
    setSearchTerm('')
  }

  // Filter jobs based on search term and filters
  const filteredJobs = useMemo(() => {
    let jobs = [...availableJobs]
    
    // Apply search term filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim()
      jobs = jobs.filter((job) => {
        const searchableText = [
          job.employer,
          job.jobType,
          job.codeLabel,
          job.route.origin,
          job.route.destination,
          ...job.sections.flatMap(section => section.rows.map(row => row.value)),
        ].join(' ').toLowerCase()
        return searchableText.includes(searchLower)
      })
    }

    // Apply transport type filter
    if (filters.transportType) {
      jobs = jobs.filter((job) => {
        const jobTypeLower = job.jobType.toLowerCase()
        if (filters.transportType === 'single') {
          return jobTypeLower.includes('single')
        } else if (filters.transportType === 'multiple') {
          return jobTypeLower.includes('multi') || jobTypeLower.includes('multiple')
        } else if (filters.transportType === 'international') {
          return jobTypeLower.includes('international')
        }
        return true
      })
    }

    // Apply price filter
    if (filters.minPrice || filters.maxPrice) {
      jobs = jobs.filter((job) => {
        const priceMatch = job.price.match(/[\d,]+/)
        if (!priceMatch) return true
        const price = parseInt(priceMatch[0].replace(/,/g, ''))
        const min = filters.minPrice ? parseInt(filters.minPrice) : 0
        const max = filters.maxPrice ? parseInt(filters.maxPrice) : Infinity
        return price >= min && price <= max
      })
    }

    // Apply location filters (province, district)
    if (filters.province || filters.district) {
      jobs = jobs.filter((job) => {
        const originLower = job.route.origin.toLowerCase()
        const destLower = job.route.destination.toLowerCase()
        const provinceMatch = !filters.province || 
          originLower.includes(filters.province.toLowerCase()) || 
          destLower.includes(filters.province.toLowerCase())
        const districtMatch = !filters.district || 
          originLower.includes(filters.district.toLowerCase()) || 
          destLower.includes(filters.district.toLowerCase())
        return provinceMatch && districtMatch
      })
    }

    return jobs
  }, [searchTerm, filters, availableJobs])

  const hasSearchResults = searchTerm.trim().length > 0
  const [confirmDialog, setConfirmDialog] = useState<RecommendedJob | null>(null)

  const handleAcceptJob = (job: RecommendedJob) => {
    setConfirmDialog(job)
  }

  const handleConfirmDialogClose = () => {
    setConfirmDialog(null)
  }

  const handleConfirmDialogConfirm = () => {
    if (confirmDialog) {
      onAcceptJob(confirmDialog.id)
    }
    setConfirmDialog(null)
  }

  return (
    <div className="home-search-screen">
      <div className="home-search-status-bar" aria-hidden="true">
        <div className="status-bar__time">9:41</div>
      </div>

      <div className="home-search-header">
        <button type="button" className="home-search-back" onClick={onBack} aria-label="Back">
          <img src={CURRENT_JOBS_BACK_ICON} alt="" />
        </button>
        <h1 className="home-search-title">Search</h1>
      </div>

      <div className="home-search-content">
        <div className="home-search-input-row">
          <form className="home-search-form" onSubmit={handleSearchSubmit}>
            <div className="home-search-input-wrapper">
              <span className="home-search-input-icon" aria-hidden="true">
                <img src={HOME_SEARCH_ICON} alt="" />
              </span>
              <input
                className="home-search-input"
                type="search"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="Search"
                autoFocus
              />
              {searchTerm && (
                <button
                  type="button"
                  className="home-search-clear"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </form>
          <button type="button" className="home-search-filter" onClick={() => setShowFilter(true)} aria-label="Filter">
            <img src={CURRENT_JOBS_FILTER_ICON} alt="" />
          </button>
        </div>

        {hasSearchResults ? (
          <div className="home-search-section">
            <div className="home-search-results-header">
              <h2 className="home-search-section-title">Search Results</h2>
              <span className="home-search-results-count">{filteredJobs.length} items</span>
            </div>
            {filteredJobs.length > 0 ? (
              <div className="home-search-results-list">
                {filteredJobs.map((job) => (
                  <article key={job.id} className="home-search-result-card">
                    <header className="home-search-result-card__header">
                      <div className="home-search-result-card__code-wrapper">
                        <span className="home-search-result-card__code">{job.codeLabel}</span>
                        <span className={`home-search-result-card__direction home-search-result-card__direction--${job.direction}`}>
                          {job.direction === 'inbound' ? 'Inbound' : 'Outbound'}
                        </span>
                      </div>
                      <div className="home-search-result-card__schedule">
                        <span>{job.date}</span>
                        <span className="home-search-result-card__schedule-divider" aria-hidden="true">—</span>
                        <span>{job.time}</span>
                      </div>
                    </header>

                    <div className="home-search-result-card__employer">
                      <span className="home-search-result-card__label">Employer</span>
                      <span className="home-search-result-card__separator">:</span>
                      <span className="home-search-result-card__value">{job.employer}</span>
                    </div>

                    <p className="home-search-result-card__job-type">{job.jobType}</p>

                    <div className="home-search-result-card__route">
                      <div className="home-search-result-card__route-item">
                        <div className="home-search-result-card__route-details">
                          <span className="home-search-result-card__route-label">Origin</span>
                          <span className="home-search-result-card__route-value">{job.route.origin}</span>
                        </div>
                      </div>
                      <div className="home-search-result-card__route-item">
                        <div className="home-search-result-card__route-details">
                          <span className="home-search-result-card__route-label">Destination</span>
                          <span className="home-search-result-card__route-value">{job.route.destination}</span>
                        </div>
                      </div>
                    </div>

                    <div className="home-search-result-card__equipment">
                      {job.sections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="home-search-result-card__equipment-section">
                          {section.rows.map((row, rowIndex) => (
                            <div key={rowIndex} className="home-search-result-card__equipment-row">
                              <span className="home-search-result-card__equipment-label">{row.label}</span>
                              <span className="home-search-result-card__equipment-separator">:</span>
                              <span className="home-search-result-card__equipment-value">{row.value}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                    <div className="home-search-result-card__price">
                      <span className="home-search-result-card__price-value">{job.price}</span>
                    </div>

                    <button type="button" className="home-search-result-card__cta" onClick={() => handleAcceptJob(job)}>
                      Accept Job
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="home-search-empty">
                <p>No jobs found matching your search criteria.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="home-search-section">
              <h2 className="home-search-section-title">Recent Searches</h2>
              <div className="home-search-chips">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    type="button"
                    className="home-search-chip"
                    onClick={() => setSearchTerm(search)}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            <div className="home-search-section">
              <h2 className="home-search-section-title">Popular Searches</h2>
              <div className="home-search-chips">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    type="button"
                    className="home-search-chip"
                    onClick={() => setSearchTerm(search)}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      {showFilter && (
        <HomeFilterScreen
          onBack={() => setShowFilter(false)}
          filters={filters}
          onFiltersChange={setFilters}
        />
      )}

      <AcceptJobConfirmDialog
        isOpen={confirmDialog !== null}
        jobCode={confirmDialog ? confirmDialog.codeLabel.replace('Order ID ', '') : ''}
        employer={confirmDialog?.employer || ''}
        onClose={handleConfirmDialogClose}
        onConfirm={handleConfirmDialogConfirm}
      />
    </div>
  )
}

type HomeFilterScreenProps = {
  onBack: () => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

function HomeFilterScreen({ onBack, filters, onFiltersChange }: HomeFilterScreenProps) {
  const [transportType, setTransportType] = useState<string>(filters.transportType)
  const [province, setProvince] = useState(filters.province)
  const [district, setDistrict] = useState(filters.district)
  const [minPrice, setMinPrice] = useState(filters.minPrice)
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice)

  // Update local state when filters prop changes
  useEffect(() => {
    setTransportType(filters.transportType)
    setProvince(filters.province)
    setDistrict(filters.district)
    setMinPrice(filters.minPrice)
    setMaxPrice(filters.maxPrice)
  }, [filters])

  const handleClear = () => {
    setTransportType('')
    setProvince('')
    setDistrict('')
    setMinPrice('')
    setMaxPrice('')
    onFiltersChange({
      transportType: '',
      province: '',
      district: '',
      minPrice: '',
      maxPrice: '',
    })
  }

  const handleSearch = () => {
    onFiltersChange({
      transportType,
      province,
      district,
      minPrice,
      maxPrice,
    })
    onBack()
  }

  return (
    <div className="home-filter-overlay">
      <div className="home-filter-backdrop" onClick={onBack}></div>
      <div className="home-filter-sheet">
        <div className="home-filter-header">
          <h2 className="home-filter-title">Filter</h2>
          <button type="button" className="home-filter-close" onClick={onBack} aria-label="Close">
            <img src={TERMS_CLOSE_ICON} alt="" />
          </button>
        </div>

        <div className="home-filter-content">
          <div className="home-filter-section">
            <label className="home-filter-label">Shipping Type</label>
            <div className="home-filter-chips-row">
              <button
                type="button"
                className={`home-filter-chip ${transportType === 'single' ? 'active' : ''}`}
                onClick={() => setTransportType(transportType === 'single' ? '' : 'single')}
              >
                Single Trip
              </button>
              <button
                type="button"
                className={`home-filter-chip ${transportType === 'multiple' ? 'active' : ''}`}
                onClick={() => setTransportType(transportType === 'multiple' ? '' : 'multiple')}
              >
                Multiple Destinations
              </button>
            </div>
            <div className="home-filter-chips-row">
              <button
                type="button"
                className={`home-filter-chip ${transportType === 'international' ? 'active' : ''}`}
                onClick={() => setTransportType(transportType === 'international' ? '' : 'international')}
              >
                International
              </button>
            </div>
          </div>

          <div className="home-filter-divider"></div>

          <div className="home-filter-section">
            <label className="home-filter-label">Province</label>
            <div className="home-filter-dropdown">
              <input
                type="text"
                className="home-filter-dropdown-input"
                placeholder="Province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              />
              <span className="home-filter-dropdown-arrow">▼</span>
            </div>
          </div>

          <div className="home-filter-section">
            <label className="home-filter-label">District</label>
            <div className="home-filter-dropdown">
              <input
                type="text"
                className="home-filter-dropdown-input"
                placeholder="District"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
              <span className="home-filter-dropdown-arrow">▼</span>
            </div>
          </div>

          <div className="home-filter-divider"></div>

          <div className="home-filter-section">
            <label className="home-filter-label">Price Range (฿)</label>
            <div className="home-filter-price-row">
              <input
                type="text"
                className="home-filter-price-input"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className="home-filter-price-separator">—</span>
              <input
                type="text"
                className="home-filter-price-input"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="home-filter-divider"></div>

          <div className="home-filter-actions">
            <button type="button" className="home-filter-clear-btn" onClick={handleClear}>
              Clear
            </button>
            <button type="button" className="home-filter-search-btn" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

type AcceptJobConfirmDialogProps = {
  isOpen: boolean
  jobCode: string
  employer: string
  onClose: () => void
  onConfirm: () => void
}

function AcceptJobConfirmDialog({ isOpen, jobCode, employer, onClose, onConfirm }: AcceptJobConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <>
      <div className="accept-job-confirm-overlay" onClick={onClose} />
      <div className="accept-job-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="accept-job-confirm-title">
        <div className="accept-job-confirm-dialog__content">
          <div className="accept-job-confirm-dialog__icon" aria-hidden="true">
            <img src={ACCEPT_JOB_CONFIRM_CHECK_ICON} alt="" />
          </div>
          <div className="accept-job-confirm-dialog__title-group">
            <h2 id="accept-job-confirm-title" className="accept-job-confirm-dialog__title">Confirm job acceptance</h2>
            <div className="accept-job-confirm-dialog__info">
              <div className="accept-job-confirm-dialog__info-row">
                <span className="accept-job-confirm-dialog__info-label">Order ID</span>
                <span className="accept-job-confirm-dialog__info-separator">:</span>
                <span className="accept-job-confirm-dialog__info-value">{jobCode}</span>
              </div>
              <div className="accept-job-confirm-dialog__info-row">
                <span className="accept-job-confirm-dialog__info-label">Employer</span>
                <span className="accept-job-confirm-dialog__info-separator">:</span>
                <span className="accept-job-confirm-dialog__info-value">{employer}</span>
              </div>
            </div>
            <p className="accept-job-confirm-dialog__description">Tap Confirm if you want to accept this job.</p>
          </div>
        </div>
        <div className="accept-job-confirm-dialog__actions">
          <button type="button" className="accept-job-confirm-dialog__cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="accept-job-confirm-dialog__confirm" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </>
  )
}

type CompanyHomeTab = 'overview' | 'jobs' | 'finance'

function CompanyHomeScreen({
  displayName,
  onOpenCurrentJobs,
  onOpenFinancial,
  onOpenCustomers,
  onOpenJobHistory,
  onOpenBids,
  onSelectTab,
}: CompanyHomeScreenProps) {
  const [activeTab, setActiveTab] = useState<CompanyHomeTab>('overview')
  const tabPanelId = 'company-home-panel'

  const topTabs: Array<{ key: CompanyHomeTab; label: string; caption: string }> = [
    { key: 'overview', label: 'Overview', caption: 'Live KPIs' },
    { key: 'jobs', label: 'Jobs', caption: 'Operations hub' },
    { key: 'finance', label: 'Finance', caption: 'Receivables' },
  ]

  const overviewMetrics = [
    { label: 'Active jobs', value: '12' },
    { label: 'Drivers on duty', value: '24' },
    { label: 'Issues flagged', value: '2' },
  ]

  const renderTabContent = () => {
    if (activeTab === 'overview') {
      return (
        <>
          <div className="company-home-card">
            <p className="company-home-card__label">Live KPIs</p>
            <div className="company-home-metrics">
              {overviewMetrics.map((metric) => (
                <div key={metric.label} className="company-home-metric">
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="company-home-card">
            <p className="company-home-card__label">Need attention</p>
            <p className="company-home-card__description">
              Stay ahead of escalations by reviewing the control center and VIP customers.
            </p>
            <div className="company-home-actions">
              <button type="button" className="company-home-cta" onClick={() => onSelectTab('control')}>
                Control center
              </button>
              <button type="button" className="company-home-cta company-home-cta--ghost" onClick={onOpenCustomers}>
                Key customers
              </button>
            </div>
          </div>
        </>
      )
    }

    if (activeTab === 'jobs') {
      return (
        <div className="company-home-card">
          <p className="company-home-card__label">Operations shortcuts</p>
          <p className="company-home-card__description">Jump directly to the workflow you need.</p>
          <div className="company-home-actions company-home-actions--stacked">
            <button type="button" className="company-home-cta" onClick={onOpenCurrentJobs}>
              Current jobs
            </button>
            <button type="button" className="company-home-cta" onClick={onOpenJobHistory}>
              Job history
            </button>
            <button type="button" className="company-home-cta" onClick={onOpenBids}>
              Bid board
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="company-home-card">
        <p className="company-home-card__label">Finance</p>
        <p className="company-home-card__description">Monitor receivables and customer credit in one place.</p>
        <div className="company-home-actions company-home-actions--stacked">
          <button type="button" className="company-home-cta" onClick={onOpenFinancial}>
            Finance dashboard
          </button>
          <button type="button" className="company-home-cta company-home-cta--ghost" onClick={onOpenCustomers}>
            Customer list
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="company-home-screen">
      <div className="company-home-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>

      <header className="company-home-header">
        <div className="company-home-header__text">
          <p>Company workspace</p>
          <h1>{displayName}</h1>
        </div>
        <button type="button" className="company-home-control-btn" onClick={() => onSelectTab('control')}>
          Control
        </button>
      </header>

      <nav className="company-home-top-tabs" role="tablist" aria-label="Company overview tabs">
        {topTabs.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={tabPanelId}
              tabIndex={isActive ? 0 : -1}
              className={`company-home-top-tab${isActive ? ' company-home-top-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="company-home-top-tab__label">{tab.label}</span>
              <span className="company-home-top-tab__caption">{tab.caption}</span>
            </button>
          )
        })}
      </nav>

      <section id={tabPanelId} className="company-home-panel" role="tabpanel">
        {renderTabContent()}
      </section>

      <BottomNav
        active="home"
        onSelect={onSelectTab}
        items={[
          { key: 'home', label: 'Home', icon: HOME_NAV_HOME_ICON },
          { key: 'chat', label: 'Chat', icon: HOME_NAV_CHAT_ICON },
          { key: 'settings', label: 'Settings', icon: HOME_NAV_SETTINGS_ICON },
        ]}
      />

      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

function CustomerHomeScreen({
  jobs,
  onAcceptJob,
  onOpenCurrentJobs,
  onOpenFinancial,
  onOpenShipping,
  onOpenCustomers,
  onOpenJobHistory,
  onOpenBids,
  onOpenProducts,
  onOpenSearch,
  onSelectTab,
}: CustomerHomeScreenProps) {
  const customerShortcuts: HomeShortcutConfig[] = [
    { id: 'current', label: 'Current jobs', icon: HOME_SHORTCUT_CURRENT_ICON, onClick: onOpenCurrentJobs },
    { id: 'revenue', label: 'Revenue', icon: HOME_SHORTCUT_REVENUE_ICON, onClick: onOpenFinancial },
    { id: 'history', label: 'Job history', icon: HOME_SHORTCUT_HISTORY_ICON, onClick: onOpenJobHistory },
  ]

  const customerBottomNav: BottomNavItemConfig[] = [
    { key: 'home', label: 'Home', icon: HOME_NAV_HOME_ICON },
    { key: 'chat', label: 'Chat', icon: HOME_NAV_CHAT_ICON },
    { key: 'settings', label: 'Settings', icon: HOME_NAV_SETTINGS_ICON },
  ]

  return (
    <HomeScreen
      jobs={jobs}
      onAcceptJob={onAcceptJob}
      onOpenCurrentJobs={onOpenCurrentJobs}
      onOpenFinancial={onOpenFinancial}
      onOpenShipping={onOpenShipping}
      onOpenCustomers={onOpenCustomers}
      onOpenJobHistory={onOpenJobHistory}
      onOpenBids={onOpenBids}
      onOpenProducts={onOpenProducts}
      onOpenSearch={onOpenSearch}
      onSelectTab={onSelectTab}
      customShortcuts={customerShortcuts}
      bottomNavItems={customerBottomNav}
    />
  )
}

function ShippingHomeScreen({
  displayName,
  onOpenFinancial,
  onOpenBids,
  onOpenShipping,
  onOpenCustomers,
  onOpenProducts,
  onOpenVehicleInformation,
  onSelectTab,
  onLogout,
}: ShippingHomeScreenProps) {
  const shippingBottomNav: BottomNavItemConfig[] = [
    { key: 'home', label: 'Dashboard', icon: HOME_NAV_HOME_ICON },
    { key: 'shipping', label: 'Transportation', icon: HOME_NAV_SHIPPING_ICON },
    { key: 'chat', label: 'Chat', icon: HOME_NAV_CHAT_ICON },
    { key: 'settings', label: 'Settings', icon: HOME_NAV_SETTINGS_ICON },
  ]

  const shippingCards: Array<{
    id: string
    title: string
    description: string
    action: string
    image: string
    onClick: () => void
  }> = [
    {
      id: 'finance',
      title: 'Finance (Expenses)',
      description: 'Track payments and expenses in one glance.',
      action: 'View finance',
      image: CARD_FINANCE_ILLUSTRATION,
      onClick: onOpenFinancial,
    },
    {
      id: 'bids',
      title: 'Bidding',
      description: 'Review and manage your bid board.',
      action: 'View bids',
      image: CARD_BIDDING_ILLUSTRATION,
      onClick: onOpenBids,
    },
    {
      id: 'shipping',
      title: 'Shipping',
      description: 'Check shipment status and\nETAs.',
      action: 'View shipping',
      image: CARD_SHIPPING_ILLUSTRATION,
      onClick: onOpenShipping,
    },
    {
      id: 'customers',
      title: 'Customer',
      description: 'See your VIP customers and contacts.',
      action: 'View customers',
      image: CARD_CUSTOMER_ILLUSTRATION,
      onClick: onOpenCustomers,
    },
    {
      id: 'products',
      title: 'Product',
      description: 'Review product categories and turnover.',
      action: 'View products',
      image: CARD_PRODUCT_ILLUSTRATION,
      onClick: onOpenProducts,
    },
    {
      id: 'vehicles',
      title: 'Vehicle',
      description: 'Manage your fleet and documents.',
      action: 'View vehicles',
      image: CARD_VEHICLE_ILLUSTRATION,
      onClick: onOpenVehicleInformation,
    },
  ]

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="shipping-home-screen">
      <div className="shipping-home-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>

      <header className="shipping-home-header">
        <div className="shipping-home-header__avatar">
          <img src={SETTINGS_PROFILE_AVATAR} alt="" />
        </div>
        <div className="shipping-home-header__text">
          <p>{getGreeting()}</p>
          <h1>{displayName}</h1>
        </div>
        <div className="shipping-home-header__actions">
          <button type="button" className="shipping-home-notification-btn" aria-label="Notifications">
            <span>3</span>
          </button>
          <button type="button" className="shipping-home-logout-btn" aria-label="Logout" onClick={onLogout}>
            <img src={SETTINGS_LOGOUT_POWER_ICON} alt="" />
          </button>
        </div>
      </header>

      <section className="shipping-home-hero">
        <div className="shipping-home-hero__text">
          <p className="shipping-home-hero__greeting">{getGreeting()},</p>
          <h2>{displayName}</h2>
          <p className="shipping-home-hero__description">
            Keep finance, bidding, shipping, and customers synced in one workspace.
          </p>
        </div>
      </section>

      <main className="shipping-home-content">
        <div className="shipping-home-cards">
          {shippingCards.map((card) => (
            <article
              key={card.id}
              className="shipping-home-card"
              role="button"
              tabIndex={0}
              onClick={card.onClick}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  card.onClick()
                }
              }}
            >
              <div className="shipping-home-card__background" />
              <div className="shipping-home-card__content">
                <div className="shipping-home-card__info">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <button
                    type="button"
                    className="shipping-home-card__cta"
                    onClick={(event) => {
                      event.stopPropagation()
                      card.onClick()
                    }}
                  >
                    {card.action}
                  </button>
                </div>
                <div className="shipping-home-card__illustration" aria-hidden="true">
                  <img src={card.image} alt="" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <BottomNav active="home" onSelect={onSelectTab} items={shippingBottomNav} />

      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

function ShippingFinanceScreen({ onBack }: ShippingFinanceScreenProps) {
  type FinanceTimeframe = 'day' | 'week' | 'month' | 'year'
  const [timeframe, setTimeframe] = useState<FinanceTimeframe>('year')
  const [yearOffset, setYearOffset] = useState(0)

  const summary = {
    paid: 100_000,
    outstanding: 30_000,
  }

  const vendorPayments = [
    { id: 'vendor-1', name: 'Express Combines', amount: 5000 },
    { id: 'vendor-2', name: 'North Supply', amount: 3000 },
    { id: 'vendor-3', name: 'Pacific Cargo', amount: 5000 },
  ]

  const spendingBreakdown = [
    { label: 'Transport costs', value: 60, color: '#0a8778' },
    { label: 'Staff costs', value: 40, color: '#00c188' },
  ]

  const chartData = useMemo(() => {
    const period: FinancialPeriod =
      timeframe === 'day' ? 'day' : timeframe === 'month' ? 'month' : timeframe === 'year' ? 'year' : 'day'
    return generateFinancialSeries(period, timeframe === 'year' ? yearOffset : 0, 37)
  }, [timeframe, yearOffset])

  const totalVendors = vendorPayments.reduce((sum, vendor) => sum + vendor.amount, 0)

  const timeframeOptions: Array<{ key: FinanceTimeframe; label: string }> = [
    { key: 'day', label: 'Day' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
  ]

  const periodLabel =
    timeframe === 'year'
      ? `Year ${2024 + yearOffset}`
      : timeframe === 'month'
        ? 'Rolling 6 months'
        : timeframe === 'week'
          ? 'Rolling 6 weeks'
          : 'This week'

  return (
    <div className="shipping-finance-screen" role="presentation">
      <div className="shipping-finance-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>

      <header className="shipping-finance-header">
        <button type="button" className="shipping-finance-header__back" onClick={onBack} aria-label="Back">
          <img src={CURRENT_JOBS_BACK_ICON} alt="" />
        </button>
        <h1>Finance</h1>
        <div className="shipping-finance-header__spacer" />
      </header>

      <main className="shipping-finance-content">
        <nav className="shipping-finance-tabs" role="tablist" aria-label="Finance timeframes">
          {timeframeOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              role="tab"
              aria-selected={timeframe === option.key}
              className={`shipping-finance-tab${timeframe === option.key ? ' shipping-finance-tab--active' : ''}`}
              onClick={() => setTimeframe(option.key)}
            >
              {option.label}
            </button>
          ))}
        </nav>

        <section className="shipping-finance-period">
          <button
            type="button"
            className="shipping-finance-period__control"
            aria-label="Previous period"
            onClick={() => setYearOffset((value) => value - 1)}
          >
            <img src={CURRENT_JOBS_BACK_ICON} alt="" />
          </button>
          <div>
            <p>Selected period</p>
            <strong>{periodLabel}</strong>
          </div>
          <button
            type="button"
            className="shipping-finance-period__control shipping-finance-period__control--next"
            aria-label="Next period"
            onClick={() => setYearOffset((value) => value + 1)}
          >
            <img src={CURRENT_JOBS_BACK_ICON} alt="" />
          </button>
        </section>

        <section className="shipping-finance-summary">
          <article className="shipping-finance-summary-card shipping-finance-summary-card--success">
            <p>Paid to date</p>
            <strong>฿ {summary.paid.toLocaleString('en-US')}</strong>
          </article>
          <article className="shipping-finance-summary-card shipping-finance-summary-card--alert">
            <p>Outstanding</p>
            <strong>฿ {summary.outstanding.toLocaleString('en-US')}</strong>
          </article>
        </section>

        <section className="shipping-finance-card">
          <div className="shipping-finance-card__header">
            <div>
              <p>Total expenses</p>
              <strong>฿ 130,000</strong>
            </div>
            <span className="shipping-finance-chip">+2% vs LY</span>
          </div>
          <FinancialChart data={chartData} />
        </section>

        <section className="shipping-finance-card shipping-finance-card--split">
          <div className="shipping-finance-card__header">
            <p>Spending breakdown</p>
          </div>
          <div className="shipping-finance-breakdown">
            <div
              className="shipping-finance-pie"
              style={{
                background: `conic-gradient(${spendingBreakdown[0].color} 0% ${spendingBreakdown[0].value}%, ${spendingBreakdown[1].color} ${spendingBreakdown[0].value}% 100%)`,
              }}
              aria-hidden="true"
            >
              <span>100%</span>
            </div>
            <ul className="shipping-finance-breakdown-list">
              {spendingBreakdown.map((item) => (
                <li key={item.label}>
                  <span className="shipping-finance-breakdown-dot" style={{ background: item.color }} />
                  <div>
                    <p>{item.label}</p>
                    <strong>{item.value}%</strong>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="shipping-finance-card shipping-finance-card--list">
          <div className="shipping-finance-card__header">
            <div>
              <p>Vendors awaiting payment</p>
              <span>{vendorPayments.length} companies</span>
            </div>
            <strong>฿ {totalVendors.toLocaleString('en-US')}</strong>
          </div>
          <div className="shipping-finance-vendors">
            {vendorPayments.map((vendor) => (
              <div key={vendor.id} className="shipping-finance-vendor-row">
                <div>
                  <p>{vendor.name}</p>
                </div>
                <strong>฿ {vendor.amount.toLocaleString('en-US')}</strong>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="home-indicator home-indicator--raised" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

function HomeScreen({
  jobs,
  onAcceptJob,
  onOpenCurrentJobs,
  onOpenFinancial,
  onOpenShipping,
  onOpenCustomers,
  onOpenJobHistory,
  onOpenBids,
  onOpenProducts,
  onOpenSearch,
  onSelectTab,
  customShortcuts,
  bottomNavItems,
}: HomeScreenProps) {
  const { t } = useTranslation()
  const [confirmDialog, setConfirmDialog] = useState<RecommendedJob | null>(null)
  const [jobCategory, setJobCategory] = useState<'domestic' | 'international'>('domestic')

  const shortcuts =
    customShortcuts ??
    ([
      { id: 'current', label: t('home.currentJobs'), icon: HOME_SHORTCUT_CURRENT_ICON, onClick: onOpenCurrentJobs },
      { id: 'revenue', label: t('home.revenue'), icon: HOME_SHORTCUT_REVENUE_ICON, onClick: onOpenFinancial },
      { id: 'bids', label: t('home.bidding'), icon: HOME_SHORTCUT_BID_ICON, onClick: onOpenBids },
      { id: 'history', label: t('home.history'), icon: HOME_SHORTCUT_HISTORY_ICON, onClick: onOpenJobHistory },
    ] satisfies HomeShortcutConfig[])

  const recommendedJobs = jobs.filter((job) => job.category === jobCategory)

  const handleAcceptJob = (job: RecommendedJob) => {
    setConfirmDialog(job)
  }

  const handleConfirmDialogClose = () => {
    setConfirmDialog(null)
  }

  const handleConfirmDialogConfirm = () => {
    if (confirmDialog) {
      onAcceptJob(confirmDialog.id)
    }
    setConfirmDialog(null)
  }

  return (
    <div className="home-screen">
      <nav className="home-shortcuts" aria-label="Quick actions">
        {shortcuts.map((shortcut) => (
          <button key={shortcut.id} type="button" className="home-shortcut" onClick={shortcut.onClick}>
            <span className="home-shortcut__icon" aria-hidden="true">
              <img src={shortcut.icon} alt="" />
            </span>
            <span className="home-shortcut__label">{shortcut.label}</span>
          </button>
        ))}
      </nav>

      <div className="home-search" role="search" onClick={onOpenSearch}>
        <span className="home-search__icon" aria-hidden="true">
          <img src={HOME_SEARCH_ICON} alt="" />
        </span>
        <input className="home-search__input" type="search" placeholder={t('common.search')} aria-label={t('common.search')} readOnly />
      </div>

      <section className="home-section" aria-labelledby="home-recommendation-title">
        <header className="home-section__header">
          <h2 id="home-recommendation-title">{t('home.recommendedJobs')}</h2>
          <div className="home-section__header-right">
            <div className="home-section__tabs" role="tablist" aria-label={t('jobs.cargoType')}>
              <button
                type="button"
                role="tab"
                className={`home-section__tab ${
                  jobCategory === 'domestic' ? 'home-section__tab--active' : ''
                }`}
                aria-selected={jobCategory === 'domestic'}
                onClick={() => setJobCategory('domestic')}
              >
                {t('jobs.domestic')}
              </button>
              <button
                type="button"
                role="tab"
                className={`home-section__tab ${
                  jobCategory === 'international' ? 'home-section__tab--active' : ''
                }`}
                aria-selected={jobCategory === 'international'}
                onClick={() => setJobCategory('international')}
              >
                {t('jobs.international')}
              </button>
            </div>
          </div>
        </header>

        <div className="home-job-card-list">
          {recommendedJobs.map((job) => (
            <article key={job.id} className="home-job-card">
              <header className="home-job-card__header">
                <div className="home-job-card__code-wrapper">
                  <span className="home-job-card__code">{job.codeLabel}</span>
                  <span className={`home-job-card__direction home-job-card__direction--${job.direction}`}>
                    {job.direction === 'inbound' ? t('jobs.inbound') : t('jobs.outbound')}
                  </span>
                </div>
                <div className="home-job-card__schedule">
                  <span>{job.date}</span>
                  <span className="home-job-card__schedule-divider" aria-hidden="true" />
                  <span>{job.time}</span>
                </div>
              </header>

              <div className="home-job-card__employer">
                <div className="home-job-card__employer-row">
                  <span className="home-job-card__label">{t('jobs.employer')}</span>
                  <span className="home-job-card__separator">:</span>
                  <span className="home-job-card__value">{job.employer}</span>
                </div>
                <p className="home-job-card__job-type">{job.jobType}</p>
              </div>

              <div className="home-job-card__route">
                <div className="home-job-card__route-info">
                  <div className="home-job-card__route-row">
                    <div className="home-job-card__route-text">
                      <span className="home-job-card__route-label">{t('jobs.origin')}</span>
                      <p>{job.route.origin}</p>
                    </div>
                  </div>
                  <span className="home-job-card__route-connector" aria-hidden="true" />
                  {job.route.stopsNote ? (
                    <>
                      <div className="home-job-card__route-row home-job-card__route-row--stops">
                        <div className="home-job-card__route-text">
                          <span className="home-job-card__route-stops">{job.route.stopsNote}</span>
                        </div>
                      </div>
                      <span className="home-job-card__route-connector" aria-hidden="true" />
                    </>
                  ) : null}
                  <div className="home-job-card__route-row home-job-card__route-row--destination">
                    <div className="home-job-card__route-text">
                      <span className="home-job-card__route-label">{t('jobs.destination')}</span>
                      <p>{job.route.destination}</p>
                    </div>
                  </div>
                </div>
                <div className="home-job-card__price">
                  <span className="home-job-card__price-chip">
                    <span>{job.price}</span>
                  </span>
                </div>
              </div>

              {job.sections.map((section, sectionIndex) => (
                <div key={`${job.id}-section-${sectionIndex}`} className="home-job-card__detail-group">
                  {section.rows.map((row, rowIndex) => (
                    <div key={`${job.id}-section-${sectionIndex}-row-${rowIndex}`} className="home-job-card__detail-row">
                      <span className="home-job-card__detail-label">{row.label}</span>
                      <span className="home-job-card__detail-separator">:</span>
                      <span className="home-job-card__detail-value">{row.value}</span>
                    </div>
                  ))}
                </div>
              ))}

              <div className="home-job-card__cta">
                <button type="button" className="home-job-card__cta-button" onClick={() => handleAcceptJob(job)}>
                  {t('jobs.acceptJob')}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <BottomNav active="home" onSelect={onSelectTab} items={bottomNavItems} />

      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>

      <AcceptJobConfirmDialog
        isOpen={confirmDialog !== null}
        jobCode={confirmDialog ? confirmDialog.codeLabel.replace('Order ID ', '') : ''}
        employer={confirmDialog?.employer || ''}
        onClose={handleConfirmDialogClose}
        onConfirm={handleConfirmDialogConfirm}
      />
    </div>
  )
}

function ControlScreen({ onOpenFinancial, onOpenShipping, onOpenCustomers, onOpenProducts, onSelectTab }: ControlScreenProps) {
  type ControlCardKey = 'financial' | 'shipping' | 'customers' | 'products'

  type ControlCardConfig = {
    key: ControlCardKey
    title: string
    description: string
    cta: string
    onClick: () => void
    background: string
    accent: string
    accentSoft: string
  }

  const controlCards: ControlCardConfig[] = [
    {
      key: 'financial',
      title: 'Finance (Expenses)',
      description: 'Track income and expenses with ease',
      cta: 'View Finance',
      onClick: onOpenFinancial,
      background: 'linear-gradient(135deg, #f2fff9 0%, #d9f5e7 100%)',
      accent: '#0a8778',
      accentSoft: 'rgba(10, 135, 120, 0.18)',
    },
    {
      key: 'shipping',
      title: 'Shipping',
      description: 'Check the status of your deliveries',
      cta: 'View Shipping',
      onClick: onOpenShipping,
      background: 'linear-gradient(135deg, #edf6ff 0%, #d4e8ff 100%)',
      accent: '#126d8a',
      accentSoft: 'rgba(18, 109, 138, 0.16)',
    },
    {
      key: 'customers',
      title: 'Customers',
      description: 'See your customer information',
      cta: 'View Customers',
      onClick: onOpenCustomers,
      background: 'linear-gradient(135deg, #f7f3ff 0%, #e3d9ff 100%)',
      accent: '#5b4fb5',
      accentSoft: 'rgba(91, 79, 181, 0.18)',
    },
    {
      key: 'products',
      title: 'Products',
      description: 'Browse your product categories',
      cta: 'View Products',
      onClick: onOpenProducts,
      background: 'linear-gradient(135deg, #fff7ec 0%, #ffe3c3 100%)',
      accent: '#f2992e',
      accentSoft: 'rgba(242, 153, 46, 0.2)',
    },
  ]

  return (
    <div className="control-screen">
      <div className="control-screen__status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>

      <div className="control-screen__hero">
        <header className="control-screen__hero-header">
          <div className="control-screen__hero-main">
            <div className="control-screen__avatar-ring">
              <img src={CONTROL_HERO_AVATAR_IMAGE} alt="Alex Walker" />
            </div>
            <div className="control-screen__greeting-card">
              <span className="control-screen__greeting-subtitle">👋 Happy Monday</span>
              <strong className="control-screen__greeting-title">Alex Walker</strong>
            </div>
          </div>
        </header>
      </div>

      <main className="control-screen__content">
        <div className="control-screen__cards">
          {controlCards.map((card) => (
            <article
              key={card.key}
              className="control-card"
              style={
                {
                  '--control-card-background': card.background,
                  '--control-card-accent': card.accent,
                  '--control-card-accent-soft': card.accentSoft,
                } as CSSProperties
              }
            >
              <div className="control-card__body">
                <h2>{card.title}</h2>
                <p>{card.description}</p>
                <button
                  type="button"
                  className="control-card__cta"
                  onClick={card.onClick}
                >
                  {card.cta}
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>

      <BottomNav active="control" onSelect={onSelectTab} />

      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

const CHAT_CATEGORY_TABS: Array<{ key: ChatCategory; label: string }> = [
  { key: 'companies', label: 'Companies' },
  { key: 'friends', label: 'Friends' },
  { key: 'groups', label: 'Groups' },
]

const CHAT_THREAD_DATA: Record<ChatCategory, ChatThread[]> = {
  companies: [
    {
      id: 'cmp-1',
      name: 'LogiStream HQ',
      initials: 'LH',
      color: 'linear-gradient(135deg, #d7e3ff 0%, #b3c7ff 100%)',
      lastMessage: 'PO-982 has been confirmed. Ready for dispatch tomorrow morning.',
      time: '09:12',
      unread: 3,
    },
    {
      id: 'cmp-2',
      name: 'Metro Freight Co.',
      initials: 'MF',
      color: 'linear-gradient(135deg, #ffe5d9 0%, #ffcbb3 100%)',
      lastMessage: 'Driver is at the loading dock waiting for the gate pass.',
      time: '08:47',
    },
    {
      id: 'cmp-3',
      name: 'Siam Export',
      initials: 'SE',
      color: 'linear-gradient(135deg, #daf5ea 0%, #b8e9d3 100%)',
      lastMessage: 'Thanks for the update. Please share POD once available.',
      time: 'Yesterday',
      unread: 1,
    },
  ],
  friends: [
    {
      id: 'fr-1',
      name: 'Nicha Pratum',
      initials: 'NP',
      color: 'linear-gradient(135deg, #ffe4f0 0%, #ffc4dd 100%)',
      lastMessage: 'Lunch near the depot after shift?',
      time: '11:05',
      online: true,
      unread: 2,
    },
    {
      id: 'fr-2',
      name: 'Arthit Boonmee',
      initials: 'AB',
      color: 'linear-gradient(135deg, #fdf0d5 0%, #f8d9a0 100%)',
      lastMessage: 'Refueled already. Meet you at checkpoint B.',
      time: '09:30',
    },
    {
      id: 'fr-3',
      name: 'Chaiyot K.',
      initials: 'CK',
      color: 'linear-gradient(135deg, #e7e6ff 0%, #cbc8ff 100%)',
      lastMessage: 'All set for tonight’s run.',
      time: 'Yesterday',
    },
  ],
  groups: [
    {
      id: 'grp-1',
      name: 'Bangkok Fleet',
      initials: 'BF',
      color: 'linear-gradient(135deg, #dff6ff 0%, #b6e7ff 100%)',
      lastMessage: 'Reminder: safety audit starts at 14:00.',
      time: '10:20',
      unread: 5,
    },
    {
      id: 'grp-2',
      name: 'Night Shift Crew',
      initials: 'NS',
      color: 'linear-gradient(135deg, #f8e8ff 0%, #dfc3ff 100%)',
      lastMessage: 'Route 3 cleared. You can enter via south gate.',
      time: '07:55',
    },
    {
      id: 'grp-3',
      name: 'Warehouse Ops',
      initials: 'WO',
      color: 'linear-gradient(135deg, #ffe9d6 0%, #ffd2ad 100%)',
      lastMessage: 'New SOP shared in the docs folder.',
      time: 'Yesterday',
    },
  ],
}

const JOB_HISTORY_DATA: JobHistoryMonth[] = [
  {
    month: 'January',
    entries: [
      {
        id: 'job-history-1',
        headerLabel: 'Idea Plus Public Co., Ltd.',
        dateLabel: '29 Jan 2021',
        timeLabel: '10:00',
        originLabel: 'Bangkok Port',
        destinationLabel: 'Laem Chabang Port Warehouse',
        chips: [
          { icon: HOME_PRICE_ICON, text: '฿ 5,000', variant: 'accent' },
          { icon: CURRENT_JOBS_DETAIL_ROUTE_ICON, text: '110 km' },
        ],
        status: { key: 'inTransit', label: 'In transit' },
        jobDetailId: 'job-1',
      },
    ],
  },
  {
    month: 'February',
    entries: [
      {
        id: 'job-history-2',
        headerLabel: 'Order ID TRK-2024-002',
        dateLabel: '29 Feb 2021',
        timeLabel: '12:00',
        summaryRows: [{ label: 'Customer', value: 'Thai PM Charter Co., Ltd.' }],
        jobType: 'Domestic transport (multi-stop)',
        originLabel: 'ThaiKen Kabin',
        stopsLabel: '2 stops',
        destinationLabel: 'Namtharn Dee Co., Ltd.',
        chips: [
          { icon: HOME_PRICE_ICON, text: '฿ 3,000', variant: 'accent' },
          { text: 'Job start', secondaryText: '15 Aug 2025 · 12:00' },
        ],
        infoBlocks: [
          { label: 'Product type', value: 'Sugar (30 boxes)' },
          { label: 'On-board equipment', value: 'Tarpaulin, dolly, sealed crates' },
          { label: 'Safety gear', value: 'Not specified' },
        ],
        status: { key: 'completed', label: 'Completed' },
        jobDetailId: 'job-2',
      },
    ],
  },
]

const CHAT_DEVICE_WIDTH = 375
const CHAT_DEVICE_HEIGHT = 812

function useChatViewportScale(baseWidth: number, baseHeight: number) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const updateScale = () => {
      const { innerWidth, innerHeight } = window
      // Make the chat phone more zoomed-in while still leaving a minimal margin
      const widthScale = innerWidth / (baseWidth + 8)
      const heightScale = innerHeight / (baseHeight + 8)
      const nextScale = Math.min(widthScale, heightScale, 1)
      setScale(nextScale)
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [baseWidth, baseHeight])

  return scale
}

function ChatScreen({ onSelectTab, userRole }: ChatScreenProps) {
  const [currentPage, setCurrentPage] = useState<
    | 'chat'
    | 'privateChat'
    | 'groupChat'
    | 'chatSubMenu'
    | 'deleteDialog'
    | 'filesAndVideos'
    | 'memberList'
    | 'addMember'
  >('chat')
  const [returnPage, setReturnPage] = useState<'chat' | 'privateChat' | 'groupChat'>('chat')

  const scale = useChatViewportScale(CHAT_DEVICE_WIDTH, CHAT_DEVICE_HEIGHT)

  useEffect(() => {
    document.body.classList.add('chat-overlay-active')
    return () => {
      document.body.classList.remove('chat-overlay-active')
    }
  }, [])

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '16px 8px',
        backgroundColor: '#f3f4f6',
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        overflow: 'auto',
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center top',
        }}
      >
        <div
          className="chat-screen"
          style={{
            width: `${CHAT_DEVICE_WIDTH}px`,
            height: `${CHAT_DEVICE_HEIGHT}px`,
          }}
        >
          {currentPage === 'chat' ? (
            <Chat
              onNavigateToChat={() => {
                setCurrentPage('privateChat')
                setReturnPage('privateChat')
              }}
              onNavigateToGroup={() => {
                setCurrentPage('groupChat')
                setReturnPage('groupChat')
              }}
              onNavigateToSubMenu={() => {
                setCurrentPage('chatSubMenu')
                setReturnPage('chat')
              }}
              onSelectTab={onSelectTab}
              userRole={userRole}
            />
          ) : currentPage === 'privateChat' ? (
            <PrivateChat
              onNavigateBack={() => setCurrentPage('chat')}
              onNavigateToSubMenu={() => {
                setCurrentPage('chatSubMenu')
                setReturnPage('privateChat')
              }}
            />
          ) : currentPage === 'groupChat' ? (
            <GroupChat
              onNavigateBack={() => setCurrentPage('chat')}
              onNavigateToSubMenu={() => {
                setCurrentPage('chatSubMenu')
                setReturnPage('groupChat')
              }}
              onNavigateToAddMember={() => {
                setCurrentPage('addMember')
                setReturnPage('groupChat')
              }}
              onNavigateToMembers={() => {
                setCurrentPage('memberList')
                setReturnPage('groupChat')
              }}
              onNavigateToFiles={() => {
                setCurrentPage('filesAndVideos')
                setReturnPage('groupChat')
              }}
              onNavigateToDelete={() => {
                setCurrentPage('deleteDialog')
                setReturnPage('groupChat')
              }}
            />
          ) : currentPage === 'chatSubMenu' ? (
            <ChatSubMenu
              onNavigateBack={() => setCurrentPage(returnPage)}
              onNavigateToDelete={() => {
                setCurrentPage('deleteDialog')
                setReturnPage('groupChat')
              }}
              onNavigateToFiles={() => {
                setCurrentPage('filesAndVideos')
                setReturnPage('groupChat')
              }}
              onNavigateToMembers={() => setCurrentPage('memberList')}
              onNavigateToAddMember={() => setCurrentPage('addMember')}
            />
          ) : currentPage === 'deleteDialog' ? (
            <DeleteConversationDialog
              onNavigateBack={() => setCurrentPage(returnPage || 'groupChat')}
              onCloseDialog={() => setCurrentPage(returnPage || 'groupChat')}
            />
          ) : currentPage === 'filesAndVideos' ? (
            <FilesAndVideos
              onNavigateBack={() => setCurrentPage(returnPage || 'groupChat')}
            />
          ) : currentPage === 'memberList' ? (
            <MemberList
              onNavigateBack={() => setCurrentPage(returnPage || 'groupChat')}
            />
          ) : (
            <AddMember
              onNavigateBack={() => setCurrentPage(returnPage || 'groupChat')}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function JobHistoryScreen({ onBack, onOpenJob }: JobHistoryScreenProps) {
  const [activeTab, setActiveTab] = useState<JobHistoryTab>('all')

  const tabs: Array<{ key: JobHistoryTab; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'inTransit', label: 'In progress' },
    { key: 'completed', label: 'Completed' },
  ]

  const hasEntriesForTab = JOB_HISTORY_DATA.some((month) =>
    month.entries.some((entry) => activeTab === 'all' || entry.status.key === activeTab),
  )

  return (
    <div className="settings-screen job-history-screen" role="presentation">
      <div className="settings-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>

      <header className="settings-header">
        <button type="button" className="settings-back" onClick={onBack} aria-label="Back">
          <img src={SETTINGS_BACK_ICON} alt="" aria-hidden="true" />
          <span className="settings-back-fallback" aria-hidden="true">
            ←
          </span>
        </button>
        <h1>Job History</h1>
        <div className="settings-header-spacer" />
      </header>

      <div className="job-history-hero" aria-hidden="true" />

      <div className="job-history-tabs">
        <div className="job-history-tabs__group" role="tablist" aria-label="Job history filters">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              className={`job-history-tab${activeTab === tab.key ? ' job-history-tab--active' : ''}`}
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
            >
              <span>{tab.label}</span>
              {activeTab === tab.key ? <span className="job-history-tab__indicator" aria-hidden="true" /> : null}
            </button>
          ))}
        </div>
        <div className="job-history-tabs__divider" aria-hidden="true" />
      </div>

      <main className="job-history-content">
        <div className="job-history-filter-group">
          <button type="button" className="job-history-filter" aria-label="Filter by month">
            <span>All months</span>
            <span className="job-history-filter__chevron" aria-hidden="true" />
          </button>
          <p className="job-history-filter__hint">Tap to adjust the month filter.</p>
        </div>

        {hasEntriesForTab ? (
          JOB_HISTORY_DATA.map((month) => {
            const visibleEntries = month.entries.filter(
              (entry) => activeTab === 'all' || entry.status.key === activeTab,
            )
            if (visibleEntries.length === 0) {
              return null
            }
            return (
              <section key={month.month} className="job-history-month">
                <div className="job-history-month__heading">
                  <p>{month.month}</p>
                  <span className="job-history-month__line" aria-hidden="true" />
                </div>
                {visibleEntries.map((entry) => (
                  <article
                    key={entry.id}
                    className="job-history-card"
                    onClick={() => {
                      if (entry.jobDetailId) {
                        onOpenJob(entry.jobDetailId)
                      }
                    }}
                    style={{ cursor: entry.jobDetailId ? 'pointer' : 'default' }}
                  >
                    <header className="job-history-card__header">
                      <div className="job-history-card__title-chip">
                        <span>{entry.headerLabel}</span>
                      </div>
                      <div className="job-history-card__meta">
                        <span className="job-history-card__meta-icon" aria-hidden="true">
                          <img src={HOME_CLOCK_ICON} alt="" />
                        </span>
                        <span>{entry.dateLabel}</span>
                        <span className="job-history-card__meta-divider" aria-hidden="true" />
                        <span>{entry.timeLabel}</span>
                      </div>
                    </header>

                    {entry.summaryRows?.map((row) => (
                      <div key={`${entry.id}-${row.label}`} className="job-history-summary-row">
                        <span className="job-history-summary-row__label">{row.label}</span>
                        <span className="job-history-summary-row__separator">:</span>
                        <span className="job-history-summary-row__value">{row.value}</span>
                      </div>
                    ))}

                    {entry.jobType ? <p className="job-history-job-type">{entry.jobType}</p> : null}

                    <div className="job-history-route">
                      <div className="job-history-route__column">
                        <div className="job-history-route__row">
                          <span className="job-history-route__icon" aria-hidden="true">
                            <img src={HOME_ROUTE_START_ICON} alt="" />
                          </span>
                          <div>
                            <p className="job-history-route__label">Origin</p>
                            <p className="job-history-route__value">{entry.originLabel}</p>
                          </div>
                        </div>

                        {entry.stopsLabel ? (
                          <div className="job-history-route__row job-history-route__row--stops">
                            <span className="job-history-route__icon" aria-hidden="true">
                              <img src={HOME_ROUTE_STOPS_ICON} alt="" />
                            </span>
                            <p className="job-history-route__stops">{entry.stopsLabel}</p>
                          </div>
                        ) : null}

                        <div className="job-history-route__row job-history-route__row--destination">
                          <span className="job-history-route__icon" aria-hidden="true">
                            <img src={HOME_ROUTE_DEST_ICON} alt="" />
                          </span>
                          <div>
                            <p className="job-history-route__label">Destination</p>
                            <p className="job-history-route__value">{entry.destinationLabel}</p>
                          </div>
                        </div>
                      </div>

                      <div className="job-history-card__chips">
                        {entry.chips.map((chip, index) => (
                          <div key={`${entry.id}-chip-${index}`} className="job-history-chip">
                            {chip.icon ? (
                              <span className="job-history-chip__icon" aria-hidden="true">
                                <img src={chip.icon} alt="" />
                              </span>
                            ) : null}
                            <div>
                              <p
                                className={`job-history-chip__text${
                                  chip.variant === 'accent' ? ' job-history-chip__text--accent' : ''
                                }`}
                              >
                                {chip.text}
                              </p>
                              {chip.secondaryText ? (
                                <p className="job-history-chip__secondary">{chip.secondaryText}</p>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {entry.infoBlocks ? (
                      <div className="job-history-info">
                        {entry.infoBlocks.map((row) => (
                          <div key={`${entry.id}-${row.label}`} className="job-history-info__row">
                            <span className="job-history-info__label">{row.label}</span>
                            <span className="job-history-info__separator">:</span>
                            <span className="job-history-info__value">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className={`job-history-status job-history-status--${entry.status.key}`}>
                      <span className="job-history-status__dot" aria-hidden="true" />
                      <span>{entry.status.label}</span>
                    </div>
                  </article>
                ))}
              </section>
            )
          })
        ) : (
          <div className="job-history-empty">
            <p>No jobs found for this filter.</p>
          </div>
        )}
      </main>

      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

type JobHistoryDetailScreenProps = {
  jobId: string
  onBack: () => void
}

// Mock data for job history details based on Figma design
const JOB_HISTORY_DETAIL_DATA: Record<string, {
  code: string
  price: string
  stopCount: number
  totalItems: number
  customer: string
  stops: Array<{
    id: string
    type: 'pickup' | 'dropoff'
    title: string
    status?: { label: string; type: 'success' }
    contactName: string
    contactRole?: string
    routeCode: string
    productType: string
    scheduleTime: string
    note?: string
  }>
  expenses?: {
    total: string
    items: Array<{
      id: string
      category: string
      amount: string
      receipts: string[]
    }>
  }
}> = {
  'job-1': {
    code: 'TRK-2024-001',
    price: '฿ 5,000',
    stopCount: 2,
    totalItems: 12,
    customer: 'Idea Plus Public Co., Ltd.',
    stops: [
      {
        id: 'stop-1',
        type: 'pickup',
        title: 'Pickup • Bangkok Port',
        status: { label: 'SOP Completed', type: 'success' },
        contactName: 'Mr. Somchai',
        contactRole: 'Warehouse Staff',
        routeCode: 'BKK001 Lat Phrao / Bangkok',
        productType: 'General Goods (12 Pallets)',
        scheduleTime: '29/01/2021 | 10:00',
        note: 'ID card required for entry',
      },
      {
        id: 'stop-2',
        type: 'dropoff',
        title: 'Drop-off • Laem Chabang Port Warehouse',
        status: { label: 'POD Completed', type: 'success' },
        contactName: 'Mr. Prasert',
        routeCode: 'LCP001 Sriracha / Chonburi',
        productType: 'General Goods (12 Pallets)',
        scheduleTime: '29/01/2021 | 15:00',
      },
    ],
    expenses: {
      total: '฿ 150',
      items: [
        {
          id: 'expense-1',
          category: 'Toll Fee',
          amount: '฿ 75',
          receipts: [CURRENT_JOBS_MAP_IMAGE],
        },
        {
          id: 'expense-2',
          category: 'Toll Fee',
          amount: '฿ 75',
          receipts: [CURRENT_JOBS_MAP_IMAGE],
        },
      ],
    },
  },
  'job-2': {
    code: 'TRK-2024-002',
    price: '฿ 3,000',
    stopCount: 4,
    totalItems: 60,
    customer: 'Thai PM Charter Co., Ltd.',
    stops: [
      {
        id: 'stop-1',
        type: 'pickup',
        title: 'Pickup • Factory 1',
        status: { label: 'SOP Completed', type: 'success' },
        contactName: 'Mr. Natthapong',
        contactRole: 'Warehouse Staff',
        routeCode: 'BKK001 Lat Phrao / Bangkok',
        productType: 'Sugar (30 Boxes)',
        scheduleTime: '15/08/2025 | 09:00',
        note: 'ID card required for entry',
      },
      {
        id: 'stop-2',
        type: 'dropoff',
        title: 'Drop-off • Chai Sugar Co.',
        status: { label: 'POD Completed', type: 'success' },
        contactName: 'Mr. Thongchai',
        routeCode: 'SAM001 Mueang / Samut Prakan',
        productType: 'Sugar (10 Boxes)',
        scheduleTime: '15/08/2025 | 09:00',
      },
      {
        id: 'stop-3',
        type: 'dropoff',
        title: 'Drop-off • Chai Sugar Co.',
        status: { label: 'POD Completed', type: 'success' },
        contactName: 'Mr. Thongchai',
        routeCode: 'SAM001 Mueang / Samut Prakan',
        productType: 'Sugar (10 Boxes)',
        scheduleTime: '15/08/2025 | 09:00',
      },
      {
        id: 'stop-4',
        type: 'dropoff',
        title: 'Drop-off • Namtharn Dee Co., Ltd.',
        contactName: 'Ms. Pornthip Nilchan',
        routeCode: 'SAM002 Phra Pradaeng / Samut Prakan',
        productType: 'Sugar (10 Boxes)',
        scheduleTime: '15/08/2025 | 13:00',
        note: 'ID card required for entry',
      },
    ],
    expenses: {
      total: '฿ 150',
      items: [
        {
          id: 'expense-1',
          category: 'Toll Fee',
          amount: '฿ 75',
          receipts: [CURRENT_JOBS_MAP_IMAGE],
        },
        {
          id: 'expense-2',
          category: 'Toll Fee',
          amount: '฿ 75',
          receipts: [CURRENT_JOBS_MAP_IMAGE],
        },
      ],
    },
  },
}

function JobHistoryDetailScreen({ jobId, onBack }: JobHistoryDetailScreenProps) {
  const [activeTab, setActiveTab] = useState<'route' | 'expenses'>('route')
  const jobData = JOB_HISTORY_DETAIL_DATA[jobId] || JOB_HISTORY_DETAIL_DATA['job-2']

  return (
    <div className="settings-screen job-history-detail-screen" role="presentation">
      <div className="settings-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>

      <header className="job-history-detail-header">
        <button type="button" className="settings-back" onClick={onBack} aria-label="Back">
          <img src={SETTINGS_BACK_ICON} alt="" aria-hidden="true" />
          <span className="settings-back-fallback" aria-hidden="true">←</span>
        </button>
        <div className="job-history-detail-header__title">
          <h1>{jobData.code}</h1>
        </div>
        <div className="settings-header-spacer" />
      </header>

      <div className="job-history-detail-hero" aria-hidden="true" />

      <div className="job-history-detail-tabs">
        <div className="job-history-detail-tabs__group" role="tablist">
          <button
            type="button"
            role="tab"
            className={`job-history-detail-tab${activeTab === 'route' ? ' job-history-detail-tab--active' : ''}`}
            aria-selected={activeTab === 'route'}
            onClick={() => setActiveTab('route')}
          >
            <span>Route</span>
            {activeTab === 'route' ? <span className="job-history-detail-tab__indicator" aria-hidden="true" /> : null}
          </button>
          <button
            type="button"
            role="tab"
            className={`job-history-detail-tab${activeTab === 'expenses' ? ' job-history-detail-tab--active' : ''}`}
            aria-selected={activeTab === 'expenses'}
            onClick={() => setActiveTab('expenses')}
          >
            <span>Expenses</span>
            {activeTab === 'expenses' ? <span className="job-history-detail-tab__indicator" aria-hidden="true" /> : null}
          </button>
        </div>
        <div className="job-history-detail-tabs__divider" aria-hidden="true" />
      </div>

      {activeTab === 'route' ? (
        <main className="job-history-detail-content">
          <div className="job-history-detail-summary">
            <div className="job-history-detail-summary-row">
              <div className="job-history-detail-summary-card job-history-detail-summary-card--price">
                <div className="job-history-detail-summary-card__icon">
                  <img src={HOME_PRICE_ICON} alt="" />
                </div>
                <div className="job-history-detail-summary-card__value">{jobData.price}</div>
              </div>
              <div className="job-history-detail-summary-card-group">
                  <div className="job-history-detail-summary-card">
                    <div className="job-history-detail-summary-card__icon">
                      <img src={CURRENT_JOBS_DETAIL_ROUTE_ICON} alt="" />
                    </div>
                    <div className="job-history-detail-summary-card__label">Pick-up/Drop-off</div>
                    <div className="job-history-detail-summary-card__value">: {jobData.stopCount}</div>
                  </div>
                  <div className="job-history-detail-summary-card">
                    <div className="job-history-detail-summary-card__icon">
                      <img src={CURRENT_JOBS_DETAIL_CARGO_ICON} alt="" />
                    </div>
                    <div className="job-history-detail-summary-card__label">Total Items</div>
                    <div className="job-history-detail-summary-card__value">: {jobData.totalItems}</div>
                  </div>
              </div>
            </div>
          </div>

          <div className="job-history-detail-customer">
            <div className="job-history-detail-customer__row">
              <span className="job-history-detail-customer__label">Employer</span>
              <span className="job-history-detail-customer__separator">:</span>
              <span className="job-history-detail-customer__value">{jobData.customer}</span>
            </div>
          </div>

          <div className="job-history-detail-stops">
            {jobData.stops.map((stop, index) => (
              <div key={stop.id} className="job-history-detail-stop">
                <div className="job-history-detail-stop__timeline">
                  {index < jobData.stops.length - 1 ? (
                    <>
                      <div className="job-history-detail-stop__icon">
                        <img src={CHECK_ICON} alt="" />
                      </div>
                      <div className="job-history-detail-stop__line" />
                    </>
                  ) : (
                    <div className="job-history-detail-stop__icon job-history-detail-stop__icon--final">
                      <img src={HOME_ROUTE_DEST_ICON} alt="" />
                    </div>
                  )}
                </div>
                <div className="job-history-detail-stop__content">
                  <div className="job-history-detail-stop__card">
                    <div className="job-history-detail-stop__header">
                      <h3 className="job-history-detail-stop__title">{stop.title}</h3>
                      {stop.status ? (
                        <div className={`job-history-detail-stop__badge job-history-detail-stop__badge--${stop.status.type}`}>
                          <span className="job-history-detail-stop__badge-dot" />
                          <span>{stop.status.label}</span>
                        </div>
                      ) : null}
                    </div>
                    <div className="job-history-detail-stop__details">
                      <div className="job-history-detail-stop__detail-row">
                        <span className="job-history-detail-stop__detail-label">Contact Name</span>
                        <span className="job-history-detail-stop__detail-separator">:</span>
                        <span className="job-history-detail-stop__detail-value">
                          {stop.contactName}
                          {stop.contactRole ? ` (${stop.contactRole})` : ''}
                        </span>
                      </div>
                      <div className="job-history-detail-stop__detail-row">
                        <span className="job-history-detail-stop__detail-label">Route</span>
                        <span className="job-history-detail-stop__detail-separator">:</span>
                        <span className="job-history-detail-stop__detail-value">{stop.routeCode}</span>
                      </div>
                      <div className="job-history-detail-stop__detail-row">
                        <span className="job-history-detail-stop__detail-label">Product Type</span>
                        <span className="job-history-detail-stop__detail-separator">:</span>
                        <span className="job-history-detail-stop__detail-value">{stop.productType}</span>
                      </div>
                      <div className="job-history-detail-stop__detail-row">
                        <span className="job-history-detail-stop__detail-label">Pick-up Time</span>
                        <span className="job-history-detail-stop__detail-separator">:</span>
                        <span className="job-history-detail-stop__detail-value">{stop.scheduleTime}</span>
                      </div>
                      {stop.note ? (
                        <div className="job-history-detail-stop__detail-row">
                          <span className="job-history-detail-stop__detail-label">Remarks</span>
                          <span className="job-history-detail-stop__detail-separator">:</span>
                          <span className="job-history-detail-stop__detail-value">{stop.note}</span>
                        </div>
                      ) : null}
                    </div>
                    <div className="job-history-detail-stop__actions">
                      <button type="button" className="job-history-detail-stop__action-btn">
                        <img src={CURRENT_JOBS_DETAIL_CALL_ICON} alt="" />
                        <span>Call</span>
                      </button>
                      <button type="button" className="job-history-detail-stop__action-btn">
                        <img src={CURRENT_JOBS_DETAIL_ROUTE_ICON} alt="" />
                        <span>Route</span>
                      </button>
                      <button type="button" className="job-history-detail-stop__action-btn">
                        <img src={CURRENT_JOBS_DETAIL_CARGO_ICON} alt="" />
                        <span>View Job Data</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      ) : (
        <main className="job-history-detail-content">
          <div className="job-history-detail-expenses">
            <div className="job-history-detail-expenses-card">
              <div className="job-history-detail-expenses-header">
                <h3 className="job-history-detail-expenses-title">Regular Expenses</h3>
              </div>
              <div className="job-history-detail-expenses-total">
                <div className="job-history-detail-expenses-total-icon">
                  <img src={HOME_PRICE_ICON} alt="" />
                </div>
                <div className="job-history-detail-expenses-total-value">{jobData.expenses?.total || '฿ 0'}</div>
              </div>
              <div className="job-history-detail-expenses-list">
                {jobData.expenses?.items.map((expense, index) => (
                  <div key={expense.id} className="job-history-detail-expense-item">
                    <div className="job-history-detail-expense-item-header">
                      <span className="job-history-detail-expense-category">{expense.category}</span>
                      <span className="job-history-detail-expense-separator">:</span>
                      <span className="job-history-detail-expense-amount">{expense.amount}</span>
                    </div>
                    <div className="job-history-detail-expense-receipts">
                      {expense.receipts.map((receipt, receiptIndex) => (
                        <div key={receiptIndex} className="job-history-detail-expense-receipt">
                          <div className="job-history-detail-expense-receipt-image">
                            <img src={receipt} alt="Receipt" />
                            <div className="job-history-detail-expense-receipt-overlay" />
                            <div className="job-history-detail-expense-receipt-camera">
                              <img src={CURRENT_JOBS_CAMERA_ICON} alt="" />
                            </div>
                            <div className="job-history-detail-expense-receipt-text">Click here to view image</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {index < (jobData.expenses?.items.length || 0) - 1 ? (
                      <div className="job-history-detail-expense-divider" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

type CurrentJobsScreenProps = {
  jobs: RecommendedJob[]
  onBack: () => void
  onOpenJob: (jobId: string) => void
}

function CurrentJobsScreen({ jobs, onBack, onOpenJob }: CurrentJobsScreenProps) {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredJobs = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase()
    if (!normalized) {
      return jobs
    }
    return jobs.filter((job) => {
      const haystack = `${job.codeLabel} ${job.employer} ${job.jobType} ${job.route.origin} ${job.route.destination}`.toLowerCase()
      return haystack.includes(normalized)
    })
  }, [searchTerm, jobs])

  return (
    <div className="current-jobs-screen" role="presentation">
      <div className="current-jobs-top">
        <div className="current-jobs-status-bar" aria-hidden="true">
          <span className="status-time">9:41</span>
        </div>
        <header className="current-jobs-header">
          <button type="button" className="current-jobs-back" onClick={onBack} aria-label={t('common.back')}>
            <img src={CURRENT_JOBS_BACK_ICON} alt="" aria-hidden="true" />
          </button>
          <h1>{t('jobs.currentJobs')}</h1>
          <span aria-hidden="true" />
        </header>
      </div>

      <main className="current-jobs-content">
        <form
          className="current-jobs-search-row"
          role="search"
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          <div className="current-jobs-search">
            <span className="current-jobs-search__icon" aria-hidden="true">
              <img src={CURRENT_JOBS_SEARCH_ICON} alt="" />
            </span>
            <input
              type="search"
              placeholder={t('home.searchPlaceholder')}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label={t('common.search')}
            />
          </div>
          <button type="button" className="current-jobs-filter" aria-label={t('common.filter')}>
            <img src={CURRENT_JOBS_FILTER_ICON} alt="" />
          </button>
        </form>

        <div className="current-jobs-list">
          {filteredJobs.length === 0 ? (
            <div className="current-jobs-empty">
              <p>{t('home.noJobsAvailable')}</p>
            </div>
          ) : (
            <>
              {filteredJobs.map((job) => (
                <article key={job.id} className="current-jobs-card">
              <header className="current-jobs-card__header">
                <span className="current-jobs-card__code">{job.codeLabel}</span>
                <div className="current-jobs-card__schedule">
                  <span className="current-jobs-card__schedule-icon" aria-hidden="true">
                    <img src={CURRENT_JOBS_CLOCK_ICON} alt="" />
                  </span>
                  <span>{job.date}</span>
                  <span className="current-jobs-card__schedule-divider" aria-hidden="true" />
                  <span>{job.time}</span>
                </div>
              </header>

              <div className="current-jobs-card__body">
                <div className="current-jobs-card__details">
                  <div className="current-jobs-card__employer">
                    <span className="current-jobs-card__label">{t('jobs.employer')}</span>
                    <span className="current-jobs-card__separator">:</span>
                    <span className="current-jobs-card__value">{job.employer}</span>
                  </div>
                  <p className="current-jobs-card__job-type">{job.jobType}</p>

                  <div className="current-jobs-card__route">
                    <div className="current-jobs-card__route-column">
                      <div className="current-jobs-card__route-row">
                        <span className="current-jobs-card__route-marker" aria-hidden="true">
                          <img src={HOME_ROUTE_START_ICON} alt="" />
                        </span>
                        <div className="current-jobs-card__route-text">
                          <span className="current-jobs-card__route-label">Origin</span>
                          <p>{job.route.origin}</p>
                        </div>
                      </div>
                      {job.route.stopsNote ? (
                        <div className="current-jobs-card__route-row current-jobs-card__route-row--stops">
                          <span className="current-jobs-card__route-marker" aria-hidden="true">
                            <img src={HOME_ROUTE_STOPS_ICON} alt="" />
                          </span>
                          <div className="current-jobs-card__route-text">
                            <span className="current-jobs-card__route-stops">{job.route.stopsNote}</span>
                          </div>
                        </div>
                      ) : null}
                      <div className="current-jobs-card__route-row current-jobs-card__route-row--destination">
                        <span className="current-jobs-card__route-marker" aria-hidden="true">
                          <img src={HOME_ROUTE_DEST_ICON} alt="" />
                        </span>
                        <div className="current-jobs-card__route-text">
                          <span className="current-jobs-card__route-label">Destination</span>
                          <p>{job.route.destination}</p>
                        </div>
                      </div>
                    </div>
                    <div className="current-jobs-card__meta">
                      <span className="current-jobs-card__price">
                        <span className="current-jobs-card__price-icon" aria-hidden="true">
                          <img src={CURRENT_JOBS_PRICE_ICON} alt="" />
                        </span>
                        <span>{job.price}</span>
                      </span>
                      {job.startDate && job.startTime ? (
                        <div className="current-jobs-card__start-time">
                          <span className="current-jobs-card__start-label">Start time</span>
                          <div className="current-jobs-card__start-values">
                            <span>{job.startDate}</span>
                            <span className="current-jobs-card__start-divider" aria-hidden="true" />
                            <span>{job.startTime}</span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                {job.sections.map((section, sectionIndex) => (
                  <div key={`${job.id}-section-${sectionIndex}`} className="current-jobs-card__detail-group">
                    {section.rows.map((row, rowIndex) => (
                      <div key={`${job.id}-section-${sectionIndex}-row-${rowIndex}`} className="current-jobs-card__detail-row">
                        <span className="current-jobs-card__detail-label">{row.label}</span>
                        <span className="current-jobs-card__detail-separator">:</span>
                        <span className="current-jobs-card__detail-value">{row.value}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <footer className="current-jobs-card__footer">
                <button type="button" className="current-jobs-card__cta" onClick={() => onOpenJob(job.id)}>
                  View job details
                </button>
              </footer>
            </article>
              ))}
            </>
          )}
        </div>
      </main>

      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

type ShippingStatisticsScreenProps = {
  onBack: () => void
}

function ShippingStatisticsScreen({ onBack }: ShippingStatisticsScreenProps) {
  type ShippingTimeframe = 'day' | 'month' | 'year'
  const [timeframe, setTimeframe] = useState<ShippingTimeframe>('year')
  const [yearOffset, setYearOffset] = useState(0)
  const [shippingTypeFilter, setShippingTypeFilter] = useState('all')

  // Convert AD year to Buddhist Era (BE) year (AD + 543)
  const getCurrentYearBE = () => {
    const date = new Date()
    const adYear = date.getFullYear() + yearOffset
    return adYear + 543 // Convert to Buddhist Era
  }

  const currentYearBE = getCurrentYearBE()
  const currentYearAD = currentYearBE - 543
  const yearLabel = `B.E. ${currentYearBE}`

  const shippingTypeOptions = [
    { value: 'all', label: 'All Shipping Types' },
    { value: 'tractor-head', label: 'Tractor Head' },
    { value: '12-wheels', label: '12 Wheels' },
    { value: '10-wheels', label: '10 Wheels' },
    { value: '6-wheels', label: '6 Wheels' },
    { value: '4-wheels', label: '4 Wheels' },
  ]

  const jobInfoCards = [
    {
      id: 'total',
      title: 'All Jobs',
      value: '300',
      change: '2%',
      icon: SHIPPING_ALL_JOBS_ICON,
    },
    {
      id: 'successful',
      title: 'Successful',
      value: '299',
      change: '2%',
      icon: SHIPPING_SUCCESS_ICON,
    },
    {
      id: 'in-progress',
      title: 'In Delivery',
      value: '1',
      change: '2%',
      icon: SHIPPING_TRUCK_ICON_1,
    },
    {
      id: 'canceled',
      title: 'Canceled',
      value: '2',
      change: '2%',
      icon: SHIPPING_CANCEL_ICON,
    },
  ]

  const shippingTypeCards = [
    {
      id: 'domestic-single',
      title: 'Domestic (Single Trip)',
      value: '100,000',
      change: '2%',
    },
    {
      id: 'domestic-multiple',
      title: 'Domestic (Multiple Stops)',
      value: '100,000',
      change: '2%',
    },
    {
      id: 'international',
      title: 'International Route',
      value: '100,000',
      change: '2%',
    },
  ]

  const regionCards = [
    { id: 'north', title: 'North', value: '300', change: '2%' },
    { id: 'central', title: 'Central', value: '300', change: '2%' },
    { id: 'northeast', title: 'Northeast', value: '300', change: '2%' },
    { id: 'east', title: 'East', value: '300', change: '2%' },
    { id: 'west', title: 'West', value: '300', change: '2%' },
    { id: 'south', title: 'South', value: '300', change: '2%' },
  ]

  const timeframeOptions: Array<{ key: ShippingTimeframe; label: string }> = [
    { key: 'day', label: 'Day' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
  ]

  return (
    <div className="shipping-statistics-screen" role="presentation">
      <div className="shipping-statistics-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>

      <header className="shipping-statistics-header">
        <button type="button" className="shipping-statistics-header__back" onClick={onBack} aria-label="Back">
          <img src={SHIPPING_ARROW_LEFT_ICON} alt="" />
        </button>
        <h1>Shipping</h1>
        <div className="shipping-statistics-header__spacer" />
      </header>

      <main className="shipping-statistics-content">
        <nav className="shipping-statistics-tabs" role="tablist" aria-label="Shipping timeframes">
          {timeframeOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              role="tab"
              aria-selected={timeframe === option.key}
              className={`shipping-statistics-tab${timeframe === option.key ? ' shipping-statistics-tab--active' : ''}`}
              onClick={() => setTimeframe(option.key)}
            >
              {option.label}
            </button>
          ))}
        </nav>

        <section className="shipping-statistics-period">
          <button
            type="button"
            className="shipping-statistics-period__control"
            aria-label="Previous year"
            onClick={() => setYearOffset((value) => value - 1)}
          >
            <img src={SHIPPING_NAV_BEFORE_ICON} alt="" />
          </button>
          <div>
            <strong>{yearLabel}</strong>
          </div>
          <button
            type="button"
            className="shipping-statistics-period__control shipping-statistics-period__control--next"
            aria-label="Next year"
            onClick={() => setYearOffset((value) => value + 1)}
          >
            <img src={SHIPPING_NAV_NEXT_ICON} alt="" />
          </button>
        </section>

        <div className="shipping-statistics-filter">
          <select
            className="shipping-statistics-filter__select"
            value={shippingTypeFilter}
            onChange={(e) => setShippingTypeFilter(e.target.value)}
            aria-label="Shipping type filter"
          >
            {shippingTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <img src={SHIPPING_ARROW_DOWN_ICON} alt="" className="shipping-statistics-filter__arrow" />
        </div>

        <section className="shipping-statistics-section">
          <div className="shipping-statistics-section__header">
            <h2>Shipping Job Information</h2>
            <span className="shipping-statistics-section__compare">Compare year: {currentYearAD - 1}</span>
          </div>
          <div className="shipping-statistics-job-info">
            {jobInfoCards.map((card) => (
              <article key={card.id} className="shipping-statistics-job-card">
                <div className="shipping-statistics-job-card__icon">
                  <img src={card.icon} alt="" />
                </div>
                <div className="shipping-statistics-job-card__content">
                  <p>{card.title}</p>
                  <div className="shipping-statistics-job-card__values">
                    <strong>{card.value}</strong>
                    <span className="shipping-statistics-job-card__change">
                      <img src={SHIPPING_ARROW_UP_ICON} alt="" className="shipping-statistics-job-card__change-icon" />
                      {card.change}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="shipping-statistics-section">
          <div className="shipping-statistics-section__header">
            <h2>Shipping by Region</h2>
            <span className="shipping-statistics-section__compare">Compare year: {currentYearAD - 1}</span>
          </div>
          <div className="shipping-statistics-type-cards">
            {shippingTypeCards.map((card) => (
              <article key={card.id} className="shipping-statistics-type-card">
                <p>{card.title}</p>
                <div className="shipping-statistics-type-card__values">
                  <strong>{card.value}</strong>
                  <span className="shipping-statistics-type-card__change">
                    <img src={SHIPPING_ARROW_UP_ICON} alt="" className="shipping-statistics-type-card__change-icon" />
                    {card.change}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="shipping-statistics-section">
          <div className="shipping-statistics-section__header">
            <h2>Shipping by Region</h2>
            <span className="shipping-statistics-section__compare">Compare year: {currentYearAD - 1}</span>
          </div>
          <div className="shipping-statistics-region-cards">
            {regionCards.map((card) => (
              <article key={card.id} className="shipping-statistics-region-card">
                <p>{card.title}</p>
                <div className="shipping-statistics-region-card__values">
                  <strong>{card.value}</strong>
                  <span className="shipping-statistics-region-card__change">
                    <img src={SHIPPING_ARROW_UP_ICON} alt="" className="shipping-statistics-region-card__change-icon" />
                    {card.change}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <div className="home-indicator home-indicator--raised" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

type CustomerStatisticsScreenProps = {
  onBack: () => void
}

function CustomerStatisticsScreen({ onBack }: CustomerStatisticsScreenProps) {
  type CustomerTimeframe = 'day' | 'month' | 'year'
  const [timeframe, setTimeframe] = useState<CustomerTimeframe>('year')
  const [yearOffset, setYearOffset] = useState(0)

  // Convert AD year to Buddhist Era (BE) year (AD + 543)
  const getCurrentYearBE = () => {
    const date = new Date()
    const adYear = date.getFullYear() + yearOffset
    return adYear + 543 // Convert to Buddhist Era
  }

  const currentYearBE = getCurrentYearBE()
  const currentYearAD = currentYearBE - 543
  const yearLabel = `B.E. ${currentYearBE}`

  const customerOverviewCards = [
    {
      id: 'factory',
      title: 'Customers (Factory)',
      value: '2,000',
      change: '2%',
      icon: CUSTOMER_BID_ICON,
    },
    {
      id: 'new',
      title: 'New Customers',
      value: '500',
      change: '2%',
      icon: SHIPPING_SUCCESS_ICON,
    },
  ]

  const topCustomers = [
    {
      id: '1',
      name: 'Paweena Wongchai',
      avatar: CUSTOMER_AVATAR_1,
      jobs: 30,
      revenue: 30000,
      pieSegment: CUSTOMER_PIE_0,
      legendDot: CUSTOMER_LEGEND_DOT_1,
    },
    {
      id: '2',
      name: 'Thanaphat Srirat',
      avatar: CUSTOMER_AVATAR_2,
      jobs: 25,
      revenue: 20000,
      pieSegment: CUSTOMER_PIE_1,
      legendDot: CUSTOMER_LEGEND_DOT_2,
    },
    {
      id: '3',
      name: 'Oranuch Wichai',
      avatar: CUSTOMER_AVATAR_3,
      jobs: 20,
      revenue: 15000,
      pieSegment: CUSTOMER_PIE_2,
      legendDot: CUSTOMER_LEGEND_DOT_3,
    },
    {
      id: '4',
      name: 'Pichitchai Sukdee',
      avatar: CUSTOMER_AVATAR_4,
      jobs: 15,
      revenue: 5000,
      pieSegment: CUSTOMER_PIE_3,
      legendDot: CUSTOMER_LEGEND_DOT_4,
    },
    {
      id: '5',
      name: 'Chanathip Suksamer',
      avatar: CUSTOMER_AVATAR_5,
      jobs: 10,
      revenue: 3000,
      pieSegment: CUSTOMER_PIE_4,
      legendDot: CUSTOMER_LEGEND_DOT_5,
    },
  ]

  const timeframeOptions: Array<{ key: CustomerTimeframe; label: string }> = [
    { key: 'day', label: 'Day' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
  ]

  return (
    <div className="customer-statistics-screen" role="presentation">
      <div className="customer-statistics-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>

      <header className="customer-statistics-header">
        <button type="button" className="customer-statistics-header__back" onClick={onBack} aria-label="Back">
          <img src={SHIPPING_ARROW_LEFT_ICON} alt="" />
        </button>
        <h1>Customer</h1>
        <div className="customer-statistics-header__spacer" />
      </header>

      <main className="customer-statistics-content">
        <nav className="customer-statistics-tabs" role="tablist" aria-label="Customer timeframes">
          {timeframeOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              role="tab"
              aria-selected={timeframe === option.key}
              className={`customer-statistics-tab${timeframe === option.key ? ' customer-statistics-tab--active' : ''}`}
              onClick={() => setTimeframe(option.key)}
            >
              {option.label}
            </button>
          ))}
        </nav>

        <section className="customer-statistics-period">
          <button
            type="button"
            className="customer-statistics-period__control"
            aria-label="Previous year"
            onClick={() => setYearOffset((value) => value - 1)}
          >
            <img src={SHIPPING_NAV_BEFORE_ICON} alt="" />
          </button>
          <div>
            <strong>{yearLabel}</strong>
          </div>
          <button
            type="button"
            className="customer-statistics-period__control customer-statistics-period__control--next"
            aria-label="Next year"
            onClick={() => setYearOffset((value) => value + 1)}
          >
            <img src={SHIPPING_NAV_NEXT_ICON} alt="" />
          </button>
        </section>

        <section className="customer-statistics-section">
          <div className="customer-statistics-section__header">
            <h2>All Customers</h2>
            <span className="customer-statistics-section__compare">Compare year: {currentYearAD - 1}</span>
          </div>
          <div className="customer-statistics-overview">
            {customerOverviewCards.map((card) => (
              <article key={card.id} className="customer-statistics-overview-card">
                <div className="customer-statistics-overview-card__icon">
                  <img src={card.icon} alt="" />
                </div>
                <div className="customer-statistics-overview-card__content">
                  <p>{card.title}</p>
                  <div className="customer-statistics-overview-card__values">
                    <strong>{card.value}</strong>
                    <span className="customer-statistics-overview-card__change">
                      <img src={SHIPPING_ARROW_UP_ICON} alt="" className="customer-statistics-overview-card__change-icon" />
                      {card.change}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="customer-statistics-chart-section">
          <div className="customer-statistics-chart-header">
            <h2>Customer</h2>
            <span>Top 5</span>
          </div>
          <div className="customer-statistics-chart-container">
            <div className="customer-statistics-pie-chart">
              <div className="customer-statistics-pie-segment customer-statistics-pie-segment--0">
                <img src={CUSTOMER_PIE_0} alt="" />
                <span className="customer-statistics-pie-label customer-statistics-pie-label--0">30</span>
              </div>
              <div className="customer-statistics-pie-segment customer-statistics-pie-segment--1">
                <img src={CUSTOMER_PIE_1} alt="" />
                <span className="customer-statistics-pie-label customer-statistics-pie-label--1">25</span>
              </div>
              <div className="customer-statistics-pie-segment customer-statistics-pie-segment--2">
                <img src={CUSTOMER_PIE_2} alt="" />
                <span className="customer-statistics-pie-label customer-statistics-pie-label--2">20</span>
              </div>
              <div className="customer-statistics-pie-segment customer-statistics-pie-segment--3">
                <img src={CUSTOMER_PIE_3} alt="" />
                <span className="customer-statistics-pie-label customer-statistics-pie-label--3">15</span>
              </div>
              <div className="customer-statistics-pie-segment customer-statistics-pie-segment--4">
                <img src={CUSTOMER_PIE_4} alt="" />
                <span className="customer-statistics-pie-label customer-statistics-pie-label--4">10</span>
              </div>
            </div>
            <div className="customer-statistics-legend">
              {topCustomers.map((customer) => (
                <div key={customer.id} className="customer-statistics-legend-item">
                  <img src={customer.legendDot} alt="" className="customer-statistics-legend-dot" />
                  <span>{customer.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="customer-statistics-list-section">
          {topCustomers.map((customer) => (
            <article key={customer.id} className="customer-statistics-list-item">
              <img src={customer.avatar} alt={customer.name} className="customer-statistics-list-item__avatar" />
              <div className="customer-statistics-list-item__name">{customer.name}</div>
              <div className="customer-statistics-list-item__jobs">{customer.jobs} jobs</div>
              <div className="customer-statistics-list-item__revenue">{formatCurrencyTHB(customer.revenue)}</div>
            </article>
          ))}
        </section>
      </main>

      <div className="home-indicator home-indicator--raised" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

type ProductStatisticsScreenProps = {
  onBack: () => void
}

function ProductStatisticsScreen({ onBack }: ProductStatisticsScreenProps) {
  type ProductTimeframe = 'day' | 'month' | 'year'
  const [timeframe, setTimeframe] = useState<ProductTimeframe>('year')
  const [yearOffset, setYearOffset] = useState(0)

  // Convert AD year to Buddhist Era (BE) year (AD + 543)
  const getCurrentYearBE = () => {
    const date = new Date()
    const adYear = date.getFullYear() + yearOffset
    return adYear + 543 // Convert to Buddhist Era
  }

  const currentYearBE = getCurrentYearBE()
  const yearLabel = `B.E. ${currentYearBE}`

  const topProducts = [
    {
      id: '1',
      name: 'Apparel',
      jobs: 30,
      revenue: 30000,
      pieSegment: PRODUCT_PIE_0,
      legendDot: PRODUCT_LEGEND_DOT_1,
      pieValue: '30',
    },
    {
      id: '2',
      name: 'Processed Wood',
      jobs: 25,
      revenue: 20000,
      pieSegment: PRODUCT_PIE_1,
      legendDot: PRODUCT_LEGEND_DOT_2,
      pieValue: '25',
    },
    {
      id: '3',
      name: 'Processed Food',
      jobs: 20,
      revenue: 15000,
      pieSegment: PRODUCT_PIE_2,
      legendDot: PRODUCT_LEGEND_DOT_3,
      pieValue: '20',
    },
    {
      id: '4',
      name: 'Fresh Food',
      jobs: 15,
      revenue: 5000,
      pieSegment: PRODUCT_PIE_3,
      legendDot: PRODUCT_LEGEND_DOT_4,
      pieValue: '15',
    },
    {
      id: '5',
      name: 'Machinery',
      jobs: 10,
      revenue: 3000,
      pieSegment: PRODUCT_PIE_4,
      legendDot: PRODUCT_LEGEND_DOT_5,
      pieValue: '10',
    },
  ]

  const timeframeOptions: Array<{ key: ProductTimeframe; label: string }> = [
    { key: 'day', label: 'Day' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
  ]

  return (
    <div className="product-statistics-screen" role="presentation">
      <div className="product-statistics-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>

      <header className="product-statistics-header">
        <button type="button" className="product-statistics-header__back" onClick={onBack} aria-label="Back">
          <img src={SHIPPING_ARROW_LEFT_ICON} alt="" />
        </button>
        <h1>Product</h1>
        <div className="product-statistics-header__spacer" />
      </header>

      <main className="product-statistics-content">
        <nav className="product-statistics-tabs" role="tablist" aria-label="Product timeframes">
          {timeframeOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              role="tab"
              aria-selected={timeframe === option.key}
              className={`product-statistics-tab${timeframe === option.key ? ' product-statistics-tab--active' : ''}`}
              onClick={() => setTimeframe(option.key)}
            >
              {option.label}
            </button>
          ))}
        </nav>

        <section className="product-statistics-period">
          <button
            type="button"
            className="product-statistics-period__control"
            aria-label="Previous year"
            onClick={() => setYearOffset((value) => value - 1)}
          >
            <img src={SHIPPING_NAV_BEFORE_ICON} alt="" />
          </button>
          <div>
            <strong>{yearLabel}</strong>
          </div>
          <button
            type="button"
            className="product-statistics-period__control product-statistics-period__control--next"
            aria-label="Next year"
            onClick={() => setYearOffset((value) => value + 1)}
          >
            <img src={SHIPPING_NAV_NEXT_ICON} alt="" />
          </button>
        </section>

        <section className="product-statistics-chart-section">
          <div className="product-statistics-chart-header">
            <h2>Product Type</h2>
            <span>Top 5</span>
          </div>
          <div className="product-statistics-chart-container">
            <div className="product-statistics-pie-chart">
              {topProducts.slice().reverse().map((product, index) => {
                const originalIndex = topProducts.length - 1 - index;
                return (
                  <div key={product.id} className={`product-statistics-pie-segment product-statistics-pie-segment--${originalIndex}`}>
                    <img src={product.pieSegment} alt="" />
                    <span className={`product-statistics-pie-label product-statistics-pie-label--${originalIndex}`}>{product.pieValue}</span>
                  </div>
                );
              })}
            </div>
            <div className="product-statistics-legend">
              {topProducts.map((product) => (
                <div key={product.id} className="product-statistics-legend-item">
                  <img src={product.legendDot} alt="" className="product-statistics-legend-dot" />
                  <span>{product.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="product-statistics-list-section">
          {topProducts.map((product) => (
            <article key={product.id} className="product-statistics-list-item">
              <div className="product-statistics-list-item__name">{product.name}</div>
              <div className="product-statistics-list-item__jobs">{product.jobs} jobs</div>
              <div className="product-statistics-list-item__revenue">{formatCurrencyTHB(product.revenue)}</div>
            </article>
          ))}
        </section>
      </main>

      <div className="home-indicator home-indicator--raised" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

type BiddingStatisticsScreenProps = {
  onBack: () => void
}

function BiddingStatisticsScreen({ onBack }: BiddingStatisticsScreenProps) {
  type BiddingTimeframe = 'day' | 'month' | 'year'
  const [timeframe, setTimeframe] = useState<BiddingTimeframe>('month')
  const [monthOffset, setMonthOffset] = useState(0)

  const getCurrentDate = () => {
    const date = new Date()
    date.setMonth(date.getMonth() + monthOffset)
    const day = date.getDate()
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()
    return { day, month, year }
  }

  const currentDate = getCurrentDate()
  const dateLabel = `< ${currentDate.day} ${currentDate.month} ${currentDate.year} >`

  const summaryCards = [
    {
      id: 'total',
      title: 'Total Bids',
      value: '1,000',
      change: '+2%',
      icon: HOME_SHORTCUT_BID_ICON,
    },
    {
      id: 'successful',
      title: 'Successful',
      value: '800',
      change: '+2%',
      icon: CHECK_ICON,
    },
    {
      id: 'pending',
      title: 'Pending Acceptance',
      value: '200',
      change: '+2%',
      icon: HOME_CLOCK_ICON,
    },
  ]

  const chartData = [
    {
      title: 'Total Quotations',
      total: '1,000',
      change: '+2%',
      breakdown: [
        { label: 'Tractor Head', value: 240, color: '#153860' },
        { label: '12 Wheels', value: 240, color: '#7B68EE' },
        { label: '10 Wheels', value: 240, color: '#DDEDFF' },
        { label: '6 Wheels', value: 140, color: '#FFB300' },
        { label: '4 Wheels', value: 140, color: '#118840' },
      ],
    },
    {
      title: 'Successful Quotations',
      total: '800',
      change: '+2%',
      breakdown: [
        { label: 'Tractor Head', value: 200, color: '#153860' },
        { label: '12 Wheels', value: 200, color: '#7B68EE' },
        { label: '10 Wheels', value: 200, color: '#DDEDFF' },
        { label: '6 Wheels', value: 100, color: '#FFB300' },
        { label: '4 Wheels', value: 100, color: '#118840' },
      ],
    },
    {
      title: 'Pending Acceptance Quotations',
      total: '200',
      change: '+2%',
      breakdown: [
        { label: 'Tractor Head', value: 40, color: '#153860' },
        { label: '12 Wheels', value: 40, color: '#7B68EE' },
        { label: '10 Wheels', value: 40, color: '#DDEDFF' },
        { label: '6 Wheels', value: 40, color: '#FFB300' },
        { label: '4 Wheels', value: 40, color: '#118840' },
      ],
    },
  ]

  const generatePieGradient = (breakdown: Array<{ value: number; color: string }>) => {
    const percentages = breakdown.map((item) => {
      const sum = breakdown.reduce((acc, b) => acc + b.value, 0)
      return { ...item, percentage: (item.value / sum) * 100 }
    })

    let gradientParts: string[] = []
    let currentPercent = 0

    percentages.forEach((item) => {
      const startPercent = currentPercent
      const endPercent = currentPercent + item.percentage
      gradientParts.push(`${item.color} ${startPercent}% ${endPercent}%`)
      currentPercent = endPercent
    })

    return `conic-gradient(${gradientParts.join(', ')})`
  }

  const timeframeOptions: Array<{ key: BiddingTimeframe; label: string }> = [
    { key: 'day', label: 'Day' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
  ]

  return (
    <div className="bidding-statistics-screen" role="presentation">
      <div className="bidding-statistics-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>

      <header className="bidding-statistics-header">
        <button type="button" className="bidding-statistics-header__back" onClick={onBack} aria-label="Back">
          <img src={CURRENT_JOBS_BACK_ICON} alt="" />
        </button>
        <h1>Bidding</h1>
        <div className="bidding-statistics-header__spacer" />
      </header>

      <main className="bidding-statistics-content">
        <nav className="bidding-statistics-tabs" role="tablist" aria-label="Bidding timeframes">
          {timeframeOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              role="tab"
              aria-selected={timeframe === option.key}
              className={`bidding-statistics-tab${timeframe === option.key ? ' bidding-statistics-tab--active' : ''}`}
              onClick={() => setTimeframe(option.key)}
            >
              {option.label}
            </button>
          ))}
        </nav>

        <section className="bidding-statistics-period">
          <button
            type="button"
            className="bidding-statistics-period__control"
            aria-label="Previous period"
            onClick={() => setMonthOffset((value) => value - 1)}
          >
            <img src={CURRENT_JOBS_BACK_ICON} alt="" />
          </button>
          <div>
            <strong>{dateLabel}</strong>
          </div>
          <button
            type="button"
            className="bidding-statistics-period__control bidding-statistics-period__control--next"
            aria-label="Next period"
            onClick={() => setMonthOffset((value) => value + 1)}
          >
            <img src={CURRENT_JOBS_BACK_ICON} alt="" />
          </button>
        </section>

        <section className="bidding-statistics-summary">
          {summaryCards.map((card) => (
            <article key={card.id} className="bidding-statistics-summary-card">
              <div className="bidding-statistics-summary-card__icon">
                <img src={card.icon} alt="" />
              </div>
              <div className="bidding-statistics-summary-card__content">
                <p>{card.title}</p>
                <div className="bidding-statistics-summary-card__values">
                  <strong>{card.value}</strong>
                  <span className="bidding-statistics-summary-card__change">▲{card.change}</span>
                </div>
              </div>
            </article>
          ))}
        </section>

        {chartData.map((chart, index) => (
          <section key={index} className="bidding-statistics-card bidding-statistics-card--split">
            <div className="bidding-statistics-card__header">
              <div>
                <p>{chart.title}</p>
                <div className="bidding-statistics-card__header-values">
                  <strong>{chart.total}</strong>
                  <span className="bidding-statistics-chip">▲{chart.change}</span>
                </div>
              </div>
              <span className="bidding-statistics-card__compare">Compare year: 2023</span>
            </div>
            <div className="bidding-statistics-breakdown">
              <div
                className="bidding-statistics-pie"
                style={{
                  background: generatePieGradient(chart.breakdown),
                }}
                aria-hidden="true"
              >
                <span>{chart.total}</span>
              </div>
              <ul className="bidding-statistics-breakdown-list">
                {chart.breakdown.map((item) => (
                  <li key={item.label}>
                    <span className="bidding-statistics-breakdown-dot" style={{ background: item.color }} />
                    <div>
                      <p>{item.label}</p>
                      <strong>{item.value}</strong>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </main>

      <div className="home-indicator home-indicator--raised" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

type BidStatus = 'open' | 'history'

type BidOrder = {
  id: string
  orderCode: string
  employer: string
  serviceType: string
  origin: string
  destination: string
  dateLabel: string
  timeLabel: string
  priceLabel: string
  equipment: string
  safetyEquipment: string
  minimumBid: number
  status: BidStatus
  submittedAmount?: number
}

const MOCK_BID_ORDERS: BidOrder[] = [
  {
    id: 'bid-1',
    orderCode: 'TRK-2024-001',
    employer: 'IdeaPlus Public Co., Ltd.',
    serviceType: 'International single-trip inbound shipment',
    origin: 'Bangkok Port',
    destination: 'Laem Chabang Port warehouse',
    dateLabel: '29 Feb 21',
    timeLabel: '10:00',
    priceLabel: 'Minimum bid: ฿ 4,500',
    equipment: 'Onboard gear: tarp, trolley, sealed crates',
    safetyEquipment: '-',
    minimumBid: 4500,
    status: 'open',
  },
  {
    id: 'bid-2',
    orderCode: 'TRK-2024-002',
    employer: 'Thai PM Charter Co., Ltd.',
    serviceType: 'Domestic multi-stop delivery',
    origin: 'ThaiKen Kabin depot',
    destination: 'XYZ Department Store',
    dateLabel: '15 Aug 25',
    timeLabel: '12:00',
    priceLabel: 'Minimum bid: ฿ 2,800',
    equipment: 'Onboard gear: tarp, trolley, sealed crates',
    safetyEquipment: '-',
    minimumBid: 2800,
    status: 'open',
  },
  {
    id: 'bid-3',
    orderCode: 'TRK-2024-003',
    employer: 'CP All Public Company Limited',
    serviceType: 'Express delivery',
    origin: 'Samut Prakan warehouse',
    destination: 'Bangkok City Center',
    dateLabel: '20 Aug 25',
    timeLabel: '08:00',
    priceLabel: 'Minimum bid: ฿ 1,200',
    equipment: 'Standard equipment',
    safetyEquipment: 'Fire extinguisher required',
    minimumBid: 1200,
    status: 'open',
  },
  {
    id: 'bid-4',
    orderCode: 'TRK-2024-004',
    employer: 'IdeaPlus Public Co., Ltd.',
    serviceType: 'Long haul freight',
    origin: 'Bangkok Central',
    destination: 'Chiang Mai Distribution Center',
    dateLabel: '10 Aug 25',
    timeLabel: '14:00',
    priceLabel: 'Submitted: ฿ 5,000',
    equipment: 'GPS tracking, temperature control',
    safetyEquipment: 'Full safety kit',
    minimumBid: 4800,
    status: 'history',
    submittedAmount: 5000,
  },
]

type BidsScreenProps = {
  onBack: () => void
  orders: BidOrder[]
  onSubmitBid: (bidId: string, amount: number) => void
}

function BidsScreen({ onBack, orders, onSubmitBid }: BidsScreenProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<BidStatus>('open')
  const [selectedBid, setSelectedBid] = useState<BidOrder | null>(null)
  const [bidAmount, setBidAmount] = useState('')
  const [successMessage, setSuccessMessage] = useState<{ title: string; description: string } | null>(null)

  useEffect(() => {
    if (!successMessage) {
      return undefined
    }
    const timeoutId = window.setTimeout(() => setSuccessMessage(null), 4000)
    return () => window.clearTimeout(timeoutId)
  }, [successMessage])

  const BidSummaryCard = ({ bid, showFooter = true }: { bid: BidOrder; showFooter?: boolean }) => (
    <article className="bids-card">
      <header className="bids-card__header">
        <div className="bids-card__titles">
          <span className="bids-card__order">{`Order ${bid.orderCode}`}</span>
          <h2 className="bids-card__title">{bid.serviceType}</h2>
        </div>
        <div className="bids-card__schedule">
          <span>{bid.dateLabel}</span>
          <span className="bids-card__schedule-divider" aria-hidden="true" />
          <span>{bid.timeLabel}</span>
        </div>
      </header>

      <div className="bids-card__locations">
        <div className="bids-card__location">
          <span className="bids-card__location-icon bids-card__location-icon--origin" aria-hidden="true">
            <img src={HOME_ROUTE_START_ICON} alt="" />
          </span>
          <div className="bids-card__location-text">
            <span className="bids-card__location-label">Origin</span>
            <strong>{bid.origin}</strong>
          </div>
        </div>
        <div className="bids-card__location">
          <span className="bids-card__location-icon bids-card__location-icon--destination" aria-hidden="true">
            <img src={HOME_ROUTE_DEST_ICON} alt="" />
          </span>
          <div className="bids-card__location-text">
            <span className="bids-card__location-label">Destination</span>
            <strong>{bid.destination}</strong>
          </div>
        </div>
      </div>

      <div className="bids-card__price-chip">
        <span className="bids-card__price-icon" aria-hidden="true">
          <img src={CURRENT_JOBS_PRICE_ICON} alt="" />
        </span>
        <span>{bid.priceLabel}</span>
      </div>

      <div className="bids-card__requirements">
        <div className="bids-card__requirements-block">
          <span className="bids-card__requirements-label">Vehicle equipment</span>
          <p>{bid.equipment}</p>
        </div>
        <div className="bids-card__requirements-block">
          <span className="bids-card__requirements-label">Safety equipment</span>
          <p>{bid.safetyEquipment}</p>
        </div>
      </div>

      {bid.status === 'history' && bid.submittedAmount ? (
        <div className="bids-card__submitted">
          <span>Submitted bid</span>
          <strong>{`฿ ${bid.submittedAmount.toLocaleString('en-US')}`}</strong>
        </div>
      ) : null}

      {showFooter ? (
        <footer className="bids-card__footer">
          {bid.status === 'open' ? (
            <button type="button" className="bids-card__cta" onClick={() => handleOpenBid(bid)}>
              Start bidding
            </button>
          ) : (
            <button type="button" className="bids-card__cta bids-card__cta--disabled" disabled>
              {bid.submittedAmount ? 'Submitted' : 'Closed'}
            </button>
          )}
        </footer>
      ) : null}
    </article>
  )

  const filteredBids = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase()
    return orders.filter((bid) => {
      if (bid.status !== activeTab) {
        return false
      }
      if (!normalized) {
        return true
      }
      const haystack = `${bid.orderCode} ${bid.employer} ${bid.serviceType} ${bid.origin} ${bid.destination}`.toLowerCase()
      return haystack.includes(normalized)
    })
  }, [activeTab, orders, searchTerm])

  const handleOpenBid = (bid: BidOrder) => {
    setSelectedBid(bid)
    setBidAmount('')
  }

  const handleCloseBid = () => {
    setSelectedBid(null)
    setBidAmount('')
  }

  const handleBidAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const sanitized = value.replace(/[^\d]/g, '')
    setBidAmount(sanitized)
  }

  const handleSubmitBid = () => {
    if (!selectedBid) {
      return
    }
    const amountNumber = Number(bidAmount)
    const minimum = selectedBid.minimumBid ?? 0
    if (!amountNumber || amountNumber < minimum) {
      window.alert(`Please enter a bid of at least ฿ ${minimum.toLocaleString('en-US')}.`)
      return
    }

    onSubmitBid(selectedBid.id, amountNumber)
    const formattedAmount = `฿ ${amountNumber.toLocaleString('en-US')}`
    setSuccessMessage({
      title: 'Bid submitted',
      description: `Order ${selectedBid.orderCode} at ${formattedAmount}`,
    })
    handleCloseBid()
  }

  return (
    <div className="bids-screen" role="presentation">
      {/* Status Bar */}
      <div className="bids-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
        <div className="status-icons">
          <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 9H15.5C14.67 9 14 8.33 14 7.5V2.5C14 1.67 14.67 1 15.5 1H17V9Z" fill="#153860" />
            <path d="M12.5 9H11C10.17 9 9.5 8.33 9.5 7.5V4.5C9.5 3.67 10.17 3 11 3H12.5V9Z" fill="#153860" />
            <path d="M8 9H6.5V6H8V9Z" fill="#153860" />
            <path d="M3.5 9H2V7.5H3.5V9Z" fill="#153860" />
          </svg>
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 0C4.74 0 2.24 1.06 0.5 2.8L1.91 4.21C3.25 2.87 5.26 2 7.5 2C9.74 2 11.75 2.87 13.09 4.21L14.5 2.8C12.76 1.06 10.26 0 7.5 0ZM7.5 4C5.84 4 4.33 4.67 3.24 5.76L4.65 7.17C5.44 6.38 6.42 5.9 7.5 5.9C8.58 5.9 9.56 6.38 10.35 7.17L11.76 5.76C10.67 4.67 9.16 4 7.5 4ZM7.5 8C6.95 8 6.45 8.22 6.08 8.58L7.5 10L8.92 8.58C8.55 8.22 8.05 8 7.5 8Z" fill="#153860" />
          </svg>
          <svg width="27" height="13" viewBox="0 0 27 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="3" width="21" height="10" rx="1.5" stroke="#153860" strokeWidth="1.2" />
            <path d="M23 6V10H25.5C25.78 10 26 9.78 26 9.5V6.5C26 6.22 25.78 6 25.5 6H23Z" fill="#153860" />
            <rect x="3" y="5" width="17" height="6" rx="0.5" fill="#153860" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <header className="bids-header">
        <button type="button" className="bids-back" onClick={selectedBid ? handleCloseBid : onBack} aria-label="Back">
          <img src={CURRENT_JOBS_BACK_ICON} alt="" />
        </button>
        <h1>{selectedBid ? selectedBid.orderCode : 'Bidding'}</h1>
      </header>

      {!selectedBid ? (
        <>
          {/* Tabs */}
          <nav className="bids-tabs" aria-label="Bid sections">
            <button
              type="button"
              className={`bids-tab ${activeTab === 'open' ? 'bids-tab--active' : ''}`}
              onClick={() => setActiveTab('open')}
            >
              Open bids
            </button>
            <button
              type="button"
              className={`bids-tab ${activeTab === 'history' ? 'bids-tab--active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
          </nav>

          <main className="bids-content">
            {successMessage ? (
              <div className="bids-toast" role="status" aria-live="polite">
                <span className="bids-toast__icon" aria-hidden="true">
                  <img src={CHECK_ICON} alt="" />
                </span>
                <div className="bids-toast__body">
                  <strong>{successMessage.title}</strong>
                  <span>{successMessage.description}</span>
                </div>
              </div>
            ) : null}
            <div className="bids-search" role="search">
              <span className="bids-search__icon" aria-hidden="true">
                <img src={CURRENT_JOBS_SEARCH_ICON} alt="" />
              </span>
              <input
                type="search"
                placeholder="Search bids"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                aria-label="Search bids"
              />
            </div>

            <div className="bids-list">
              {filteredBids.map((bid) => (
                <BidSummaryCard key={bid.id} bid={bid} />
              ))}
              {filteredBids.length === 0 ? (
                <div className="bids-empty">
                  <p>No bids in this list.</p>
                </div>
              ) : null}
            </div>
          </main>
        </>
      ) : (
        <main className="bid-entry">
          <section className="bid-entry__form" aria-labelledby="bid-amount">
            <label className="bid-entry__label" htmlFor="bid-amount">
              Bid amount (฿) <span aria-hidden="true">*</span>
            </label>
            <input
              id="bid-amount"
              className="bid-entry__input"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="0"
              value={bidAmount}
              onChange={handleBidAmountChange}
              aria-required="true"
              aria-describedby="bid-helper"
            />
            <p id="bid-helper" className="bid-entry__helper">
              Minimum bid {selectedBid?.minimumBid ? `฿ ${selectedBid.minimumBid.toLocaleString('en-US')}` : 'required'}.
            </p>
            <button type="button" className="bid-entry__submit" onClick={handleSubmitBid}>
              Submit bid
            </button>
          </section>
        </main>
      )}

      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

type CurrentJobDetailScreenProps = {
  jobId: string
  onBack: () => void
  onClose: () => void
  onOpenStatus: (stopId: string) => void
  onOpenPayment: (stopId: string) => void
  onOpenInfo: (stopId: string) => void
  checkedInStops: Record<string, boolean>
  submittedSop: Record<string, { url: string; name: string }>
  paidStops: Record<string, boolean>
  paymentMethodByStop: Record<string, string>
  jobStarted: boolean
  nextTaskStopId: string | null
  canStartJob: boolean
  onStartJob: () => void
  notification: { title: string; description?: string } | null
  onDismissNotification: () => void
}

function CurrentJobDetailScreen({
  jobId,
  onBack,
  onClose,
  onOpenStatus,
  onOpenPayment,
  onOpenInfo,
  checkedInStops,
  submittedSop,
  paidStops,
  paymentMethodByStop,
  jobStarted,
  nextTaskStopId,
  canStartJob,
  onStartJob,
  notification,
  onDismissNotification,
}: CurrentJobDetailScreenProps) {
  const detail = CURRENT_JOB_DETAILS[jobId] ?? CURRENT_JOB_DETAILS['job-1']
  const nextTaskStop = jobStarted && nextTaskStopId ? detail.stops.find((stop) => stop.id === nextTaskStopId) : null
  const footerLabel = jobStarted ? nextTaskStop?.checkInCta ?? 'Update status' : detail.footerCta
  const footerDisabled = jobStarted ? !nextTaskStopId : !canStartJob
  const footerClassName = [
    'current-job-detail-footer__cta',
    footerDisabled
      ? 'current-job-detail-footer__cta--disabled'
      : jobStarted
        ? 'current-job-detail-footer__cta--success'
        : 'current-job-detail-footer__cta--primary',
  ]
    .filter(Boolean)
    .join(' ')

  const handleFooterAction = () => {
    if (footerDisabled) {
      return
    }

    if (jobStarted) {
      if (nextTaskStopId) {
        onOpenStatus(nextTaskStopId)
      }
    } else {
      onStartJob()
    }
  }

  const contentClassName = ['current-job-detail-content']
  if (notification) {
    contentClassName.push('current-job-detail-content--with-toast')
  }

  return (
    <div className="current-job-detail-screen" role="presentation">
      <div className="current-job-detail-ambient" aria-hidden="true" />
      <div className="current-job-detail-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>
      <header className="current-job-detail-header">
        <button type="button" className="current-job-detail-back" onClick={onBack} aria-label="Back to current jobs">
          <img src={CURRENT_JOBS_BACK_ICON} alt="" aria-hidden="true" />
        </button>
        <h1>{detail.code}</h1>
        <button type="button" className="current-job-detail-close" onClick={onClose} aria-label="Back to home">
          <span />
        </button>
      </header>

      {notification ? (
        <div className="current-job-detail-toast" role="status" aria-live="polite">
          <span className="current-job-detail-toast__icon" aria-hidden="true">
            <img src={CURRENT_JOBS_SUCCESS_ICON} alt="" />
          </span>
          <div className="current-job-detail-toast__body">
            <p className="current-job-detail-toast__title">{notification.title}</p>
            {notification.description ? (
              <p className="current-job-detail-toast__description">{notification.description}</p>
            ) : null}
          </div>
          <button
            type="button"
            className="current-job-detail-toast__close"
            onClick={onDismissNotification}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ) : null}

      <main className={contentClassName.join(' ')}>
        <section className="current-job-detail-summary">
          <div className="current-job-detail-metric">
            <span className="current-job-detail-metric__icon" aria-hidden="true">
              <img src={CURRENT_JOBS_PRICE_ICON} alt="" />
            </span>
            <span className="current-job-detail-metric__label">Fee</span>
            <span className="current-job-detail-metric__value">{detail.price}</span>
          </div>
          <div className="current-job-detail-metric">
            <span className="current-job-detail-metric__icon" aria-hidden="true">
              <img src={CURRENT_JOBS_DETAIL_ROUTE_ICON} alt="" />
            </span>
            <span className="current-job-detail-metric__label">Stops</span>
            <span className="current-job-detail-metric__value">{detail.stopCount}</span>
          </div>
          <div className="current-job-detail-metric">
            <span className="current-job-detail-metric__icon" aria-hidden="true">
              <img src={CURRENT_JOBS_DETAIL_CARGO_ICON} alt="" />
            </span>
            <span className="current-job-detail-metric__label">Cargo</span>
            <span className="current-job-detail-metric__value">{detail.cargoTotal}</span>
          </div>
        </section>

        <button type="button" className="current-job-detail-action">
          <span className="current-job-detail-action__icon" aria-hidden="true">
            <img src={CURRENT_JOBS_REPORT_ICON} alt="" />
          </span>
          {detail.issueLabel}
        </button>

        <section className="current-job-detail-customer">
          <header>
            <span className="current-job-detail-customer__label">Customer</span>
            <span className="current-job-detail-customer__value">{detail.customer}</span>
          </header>
          <div className="current-job-detail-stops">
            {detail.stops.map((stop, index) => {
              const showLine = index < detail.stops.length - 1
              const isCheckedIn = Boolean(checkedInStops[stop.id])
              const sopEntry = submittedSop[stop.id]
              const isNextTaskStop = jobStarted && nextTaskStopId === stop.id
              const isPaid = Boolean(paidStops[stop.id])
              const paymentMethodLabel = paymentMethodByStop[stop.id] ?? stop.paymentInfo?.method ?? ''
              const baseBadge = sopEntry
                ? { label: 'POD confirmed', tone: 'success' as const }
                : stop.badge
              const badge =
                isPaid
                  ? { label: 'Payment completed', tone: 'success' as const }
                  : baseBadge ?? (isNextTaskStop ? { label: 'Awaiting confirmation', tone: 'warning' as const } : undefined)
              const isActiveStop =
                stop.isHighlighted || isCheckedIn || Boolean(sopEntry) || isNextTaskStop
              const hasStatusAction = stop.actions.some((action) => action.key === 'status')
              const baseActions =
                isNextTaskStop && !hasStatusAction
                  ? [...stop.actions, { key: 'status' as const, label: 'Update status' }]
                  : stop.actions
              const actions = isCheckedIn ? baseActions : baseActions.filter((action) => action.key !== 'info')
              const enrichedActions =
                isCheckedIn && stop.postCheckInCta && !isPaid
                  ? [...actions, { key: 'pay' as const, label: stop.postCheckInCta }]
                  : actions
              return (
                <article
                  key={stop.id}
                  className={`current-job-detail-stop ${
                    isActiveStop ? 'current-job-detail-stop--active' : ''
                  }`}
                >
                  <div className="current-job-detail-stop__rail" aria-hidden="true">
                    <span className="current-job-detail-stop__dot" />
                    {showLine ? <span className="current-job-detail-stop__line" /> : null}
                  </div>
                  <div className="current-job-detail-stop__card">
                    {isCheckedIn ? (
                      <div className="current-job-detail-stop__status">
                        <span className="current-job-detail-stop__status-icon" aria-hidden="true">
                          <img src={CURRENT_JOBS_SUCCESS_ICON} alt="" />
                        </span>
                        <div>
                          <p>Checked in</p>
                          <span>{stop.checkInValue ?? stop.scheduleValue}</span>
                        </div>
                      </div>
                    ) : null}
                    <header className="current-job-detail-stop__header">
                      <div>
                        <h2>{stop.title}</h2>
                        {badge ? (
                          <span className={`current-job-detail-stop__badge current-job-detail-stop__badge--${badge.tone}`}>
                            {badge.label}
                          </span>
                        ) : null}
                      </div>
                    </header>
                    <dl className="current-job-detail-stop__meta">
                      <div>
                        <dt>Contact</dt>
                        <dd>
                          {stop.contactName}
                          {stop.contactRole ? ` (${stop.contactRole})` : ''}
                        </dd>
                      </div>
                      <div>
                        <dt>Route</dt>
                        <dd>{stop.routeCode}</dd>
                      </div>
                      <div>
                        <dt>Cargo</dt>
                        <dd>{stop.cargo}</dd>
                      </div>
                      <div>
                        <dt>{stop.scheduleLabel}</dt>
                        <dd>{stop.scheduleValue}</dd>
                      </div>
                      {stop.note ? (
                        <div>
                          <dt>Note</dt>
                          <dd>{stop.note}</dd>
                        </div>
                      ) : null}
                      {isCheckedIn && stop.address ? (
                        <div>
                          <dt>Address</dt>
                          <dd>{stop.address}</dd>
                        </div>
                      ) : null}
                    </dl>

                    {isCheckedIn && stop.mapImage ? (
                      <div className="current-job-detail-stop__map" aria-label="Stop map">
                        <img src={stop.mapImage} alt="" />
                      </div>
                    ) : null}

                    {isCheckedIn && stop.paymentInfo ? (
                      <div
                        className={`current-job-detail-stop__payment ${
                          isPaid ? 'current-job-detail-stop__payment--success' : 'current-job-detail-stop__payment--pending'
                        }`}
                      >
                        <header>
                          <span>Payment details</span>
                          <span className="current-job-detail-stop__payment-status">
                            {isPaid ? 'Payment completed' : 'Awaiting payment'}
                          </span>
                        </header>
                        <div className="current-job-detail-stop__payment-grid">
                          <div>
                            <span>Method</span>
                            <strong>{paymentMethodLabel || '—'}</strong>
                          </div>
                          <div>
                            <span>Amount</span>
                            <strong>{stop.paymentInfo.amount}</strong>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {isCheckedIn && sopEntry ? (
                      <div className="current-job-detail-stop__sop">
                        <div className="current-job-detail-stop__status current-job-detail-stop__status--sop">
                          <span className="current-job-detail-stop__status-icon" aria-hidden="true">
                            <img src={CURRENT_JOBS_SUCCESS_ICON} alt="" />
                          </span>
                          <div>
                            <p>POD confirmed</p>
                            <span>{stop.checkInValue ?? stop.scheduleValue}</span>
                          </div>
                        </div>
                        <div className="current-job-detail-stop__sop-photo">
                          <div className="current-job-detail-stop__sop-photo-preview" aria-label="Uploaded POD photo">
                            <img src={sopEntry.url} alt="" />
                            <span className="current-job-detail-stop__sop-photo-overlay" aria-hidden="true" />
                            <span className="current-job-detail-stop__sop-photo-camera" aria-hidden="true">
                              <img src={CURRENT_JOBS_SOP_CAMERA_ICON} alt="" />
                            </span>
                            <span
                              className="current-job-detail-stop__sop-photo-text"
                              title={sopEntry.name}
                            >
                              Tap to view photo
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {enrichedActions.length ? (
                      <div className="current-job-detail-stop__actions">
                        {enrichedActions.map((action) => {
                          const label =
                            action.key === 'status' && isCheckedIn
                              ? sopEntry
                                ? isPaid
                                  ? 'View POD'
                                  : 'View SOP'
                                : isPaid
                                  ? 'Confirm POD'
                                  : 'Confirm SOP'
                              : action.label
                          const handleClick =
                            action.key === 'status'
                              ? () => onOpenStatus(stop.id)
                              : action.key === 'pay'
                                ? () => onOpenPayment(stop.id)
                                : action.key === 'info'
                                  ? () => onOpenInfo(stop.id)
                                  : () => {
                                      // Placeholder for future integrations
                                    }
                          return (
                            <button
                              key={action.key}
                              type="button"
                              className={`current-job-detail-stop__action current-job-detail-stop__action--${action.key}`}
                              onClick={handleClick}
                            >
                              <span className="current-job-detail-stop__action-icon" aria-hidden="true">
                                {action.key === 'call' ? (
                                  <img src={CURRENT_JOBS_DETAIL_CALL_ICON} alt="" />
                                ) : action.key === 'route' ? (
                                  <img src={CURRENT_JOBS_DETAIL_ROUTE_ACTION_ICON} alt="" />
                                ) : action.key === 'pay' ? (
                                  <img src={CURRENT_JOBS_PRICE_ICON} alt="" />
                                ) : action.key === 'info' ? (
                                  <img src={CURRENT_JOBS_DETAIL_STATUS_ICON} alt="" />
                                ) : (
                                  <img src={CURRENT_JOBS_DETAIL_STATUS_ICON} alt="" />
                                )}
                              </span>
                              <span>{label}</span>
                            </button>
                          )
                        })}
                      </div>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </main>

      <footer className="current-job-detail-footer">
        <button
          type="button"
          className={footerClassName}
          onClick={handleFooterAction}
          disabled={footerDisabled}
        >
          {footerLabel}
        </button>
      </footer>

      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

type CurrentJobUpdateScreenProps = {
  jobId: string
  stopId: string
  onBack: () => void
  onClose: () => void
  onConfirmCheckIn: (stopId: string) => void
  checkedInStops: Record<string, boolean>
  paidStops: Record<string, boolean>
  paymentMethodByStop: Record<string, string>
  submittedSop: Record<string, { url: string; name: string }>
  onOpenPayment: (stopId: string) => void
  onOpenSop: (stopId: string) => void
  onViewExpenses: () => void
  onAddExpense: () => void
  onReportIssue?: () => void
}

function CurrentJobUpdateScreen({
  jobId,
  stopId,
  onBack,
  onClose,
  onConfirmCheckIn,
  checkedInStops,
  paidStops,
  paymentMethodByStop,
  submittedSop,
  onOpenPayment,
  onOpenSop,
  onViewExpenses,
  onAddExpense,
  onReportIssue,
}: CurrentJobUpdateScreenProps) {
  const detail = CURRENT_JOB_DETAILS[jobId] ?? CURRENT_JOB_DETAILS['job-1']
  const stop = detail.stops.find((entry) => entry.id === stopId) ?? detail.stops[0]
  const [showCheckInDialog, setShowCheckInDialog] = useState(false)
  const [showReportIssueModal, setShowReportIssueModal] = useState(false)
  const baseBadge = stop.badge ?? null
  const timingLabel = stop.checkInLabel ?? stop.scheduleLabel
  const timingValue = stop.checkInValue ?? stop.scheduleValue
  const isCheckedIn = Boolean(checkedInStops[stop.id])
  const isPaid = Boolean(paidStops[stop.id])
  const badge = isCheckedIn ? { label: 'Checked in', tone: 'success' as const } : baseBadge
  const sopEntry = submittedSop[stop.id] ?? null
  const hasSop = Boolean(sopEntry)
  const paymentMethodLabel = paymentMethodByStop[stop.id] ?? stop.paymentInfo?.method ?? ''
  const paymentInfo = isCheckedIn ? { amount: stop.paymentInfo?.amount ?? '-', method: paymentMethodLabel } : undefined
  const quickActions = [
    { key: 'view-expenses', icon: CURRENT_JOBS_VIEW_EXPENSES_ICON, label: 'View expenses', onClick: onViewExpenses },
    { key: 'add-expense', icon: CURRENT_JOBS_ADD_EXPENSE_ICON, label: 'Add expense', onClick: onAddExpense },
    {
      key: 'report-issue',
      icon: CURRENT_JOBS_REPORT_ISSUE_ICON,
      label: 'Report issue',
      onClick: () => setShowReportIssueModal(true),
    },
  ]
  const footerState = (() => {
    if (!isCheckedIn) {
      return {
        label: stop.checkInCta ?? 'Check in',
        icon: CURRENT_JOBS_CHECKIN_ICON,
        disabled: false,
        action: () => setShowCheckInDialog(true),
      }
    }

    if (!isPaid) {
      return {
        label: stop.postCheckInCta ?? 'Pay',
        icon: stop.postCheckInIcon ?? CURRENT_JOBS_PRICE_ICON,
        disabled: false,
        action: () => onOpenPayment(stop.id),
      }
    }

    if (!hasSop) {
      return {
        label: 'Next',
        icon: CURRENT_JOBS_BOX_ICON,
        disabled: false,
        action: () => onOpenSop(stop.id),
      }
    }

    return {
      label: 'POD confirmed',
      icon: CURRENT_JOBS_SUCCESS_ICON,
      disabled: true,
      action: () => {},
    }
  })()

  type DetailRow =
    | { type: 'text'; key: string; label: string; value: string }
    | { type: 'map'; key: string; image: string; alt: string }

  const detailRows: DetailRow[] = [
    {
      type: 'text',
      key: 'contact',
      label: 'Contact',
      value: `${stop.contactName}${stop.contactRole ? ` (${stop.contactRole})` : ''}`,
    },
    {
      type: 'text',
      key: 'route',
      label: 'Route',
      value: stop.routeCode,
    },
  ]

  if (stop.address) {
    detailRows.push({
      type: 'text',
      key: 'address',
      label: 'Address',
      value: stop.address,
    })
  }

  if (stop.mapImage) {
    detailRows.push({
      type: 'map',
      key: 'map',
      image: stop.mapImage,
      alt: `${stop.title} map`,
    })
  }

  if (stop.productDescription ?? stop.cargo) {
    detailRows.push({
      type: 'text',
      key: 'product',
      label: 'Product',
      value: stop.productDescription ?? stop.cargo ?? '',
    })
  }

  if (timingLabel && timingValue) {
    detailRows.push({
      type: 'text',
      key: 'schedule',
      label: timingLabel,
      value: timingValue,
    })
  }

  if (stop.note) {
    detailRows.push({
      type: 'text',
      key: 'note',
      label: 'Note',
      value: stop.note,
    })
  }

  const paymentTimestamp = (paymentInfo as { amount: string; method: string; timestamp?: string } | null)?.timestamp ?? stop.checkInValue ?? stop.scheduleValue ?? '—'

  return (
    <div className="current-job-update-screen" role="presentation">
      <div className="current-job-update-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>
      <header className="current-job-update-header">
        <button type="button" className="current-job-update-back" onClick={onBack} aria-label="Back to job detail">
          <img src={CURRENT_JOBS_BACK_ICON} alt="" aria-hidden="true" />
        </button>
        <h1>{stop.title}</h1>
        <button type="button" className="current-job-update-close" onClick={onClose} aria-label="Back to home">
          <span />
        </button>
      </header>

      <main className="current-job-update-content">
        <section className="current-job-update-shortcuts" aria-label="Stop quick actions">
          {quickActions.map((action, index) => {
            const isLast = index === quickActions.length - 1
            return (
              <button key={action.key} type="button" className="current-job-update-shortcut" onClick={action.onClick}>
                <span className="current-job-update-shortcut__icon" aria-hidden="true">
                  <img src={action.icon} alt="" />
                </span>
                <span className="current-job-update-shortcut__label">{action.label}</span>
                {isLast ? null : <span className="current-job-update-shortcut__divider" aria-hidden="true" />}
              </button>
            )
          })}
        </section>

        <section className="current-job-update-details">
          <header className="current-job-update-details__header">
            <h2>{stop.title}</h2>
            {badge ? (
              <span className={`current-job-update-badge current-job-update-badge--${badge.tone}`}>{badge.label}</span>
            ) : null}
          </header>

          {isCheckedIn ? (
            <div className="current-job-update-success-card">
              <span className="current-job-update-success-card__icon" aria-hidden="true">
                <img src={CURRENT_JOBS_SUCCESS_ICON} alt="" />
              </span>
              <div>
                <p>Checked in successfully</p>
                <span>{timingValue}</span>
              </div>
            </div>
          ) : null}

          {paymentInfo ? (
            <div
              className={`current-job-update-payment ${
                isPaid ? 'current-job-update-payment--success' : 'current-job-update-payment--pending'
              }`}
            >
              <div className="current-job-update-payment__status">
                <span className="current-job-update-payment__status-icon" aria-hidden="true">
                  <img src={isPaid ? CURRENT_JOBS_SUCCESS_ICON : CURRENT_JOBS_PRICE_ICON} alt="" />
                </span>
                <div className="current-job-update-payment__status-text">
                  <p>{isPaid ? 'Payment completed' : 'Awaiting payment'}</p>
                  <span>{paymentTimestamp}</span>
                </div>
              </div>
              <div className="current-job-update-payment__grid">
                <div>
                  <span>Method</span>
                  <strong>{paymentInfo.method}</strong>
                </div>
                <div>
                  <span>Amount</span>
                  <strong>{paymentInfo.amount}</strong>
                </div>
              </div>
            </div>
          ) : null}

          {isCheckedIn ? (
            <div className="current-job-update-upload" role="presentation">
              <header>
                <span>Upload document (POD)</span>
                <span aria-hidden="true">*</span>
              </header>
              <button
                type="button"
                className={`current-job-update-upload__frame${
                  hasSop ? ' current-job-update-upload__frame--has-photo' : ''
                }`}
                onClick={() => onOpenSop(stop.id)}
                aria-label={hasSop ? 'View uploaded delivery document' : 'Upload delivery document'}
              >
                {hasSop && sopEntry ? (
                  <div className="current-job-update-upload__preview" aria-label="Uploaded POD document">
                    <span className="current-job-update-upload__check" aria-hidden="true">
                      <img src={CURRENT_JOBS_SUCCESS_ICON} alt="" />
                    </span>
                    <img src={sopEntry.url} alt="" />
                    <span className="current-job-update-upload__overlay" aria-hidden="true" />
                    <span className="current-job-update-upload__camera" aria-hidden="true">
                      <img src={CURRENT_JOBS_CAMERA_ICON} alt="" />
                    </span>
                    <span className="current-job-update-upload__text" title={sopEntry.name}>
                      Tap to view document
                    </span>
                  </div>
                ) : (
                  <>
                    <span className="current-job-update-upload__icon" aria-hidden="true">
                      <img src={CURRENT_JOBS_CAMERA_ICON} alt="" />
                    </span>
                    <p>
                      Tap to capture or choose
                      <br />
                      delivery document
                    </p>
                  </>
                )}
              </button>
            </div>
          ) : null}

          <div className="current-job-update-details__rows">
            {detailRows.map((row, index) => {
              const isLast = index === detailRows.length - 1
              if (row.type === 'map') {
                return (
                  <div
                    key={row.key}
                    className={`current-job-update-detail-item current-job-update-detail-item--map${
                      isLast ? ' current-job-update-detail-item--last' : ''
                    }`}
                    aria-label="Stop map"
                  >
                    <div className="current-job-update-map">
                      <img src={row.image} alt={row.alt} />
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={row.key}
                  className={`current-job-update-detail-item${isLast ? ' current-job-update-detail-item--last' : ''}`}
                >
                  <span className="current-job-update-detail-item__label">{row.label}</span>
                  <span className="current-job-update-detail-item__value">{row.value}</span>
                </div>
              )
            })}
          </div>
        </section>

        <section className="current-job-update-secondary-actions">
          <button type="button" className="current-job-update-secondary-action">
            <span className="current-job-update-secondary-action__icon" aria-hidden="true">
              <img src={CURRENT_JOBS_DETAIL_CALL_ICON} alt="" />
            </span>
            Call
          </button>
          <button type="button" className="current-job-update-secondary-action">
            <span className="current-job-update-secondary-action__icon" aria-hidden="true">
              <img src={CURRENT_JOBS_DETAIL_ROUTE_ACTION_ICON} alt="" />
            </span>
            Route
          </button>
        </section>
      </main>

      <footer className="current-job-update-footer">
        <button
          type="button"
          className="current-job-update-footer__cta"
          onClick={() => {
            if (footerState.disabled) {
              return
            }
            footerState.action()
          }}
          disabled={footerState.disabled}
        >
          <span aria-hidden="true">
            <img src={footerState.icon} alt="" />
          </span>
          {footerState.label}
        </button>
      </footer>

      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>

      {showCheckInDialog ? (
        <div className="current-job-checkin-overlay" role="dialog" aria-modal="true">
          <div className="current-job-checkin-dialog">
            <div className="current-job-checkin-dialog__icon" aria-hidden="true">
              <img src={CURRENT_JOBS_CHECK_ICON} alt="" />
            </div>
            <h2>Confirm check-in</h2>
            <p>
              Do you want to check in at <strong>{stop.title}</strong>?
            </p>
            <div className="current-job-checkin-dialog__actions">
              <button type="button" onClick={() => setShowCheckInDialog(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="current-job-checkin-dialog__confirm"
                onClick={() => {
                  setShowCheckInDialog(false)
                  onConfirmCheckIn(stop.id)
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ReportIssueModal isOpen={showReportIssueModal} onClose={() => setShowReportIssueModal(false)} />
    </div>
  )
}

type CurrentJobPaymentScreenProps = {
  jobId: string
  stopId: string
  onBack: () => void
  onClose: () => void
  onConfirmPayment: (stopId: string, methodLabel: string) => void
  initialMethod?: string
}

function CurrentJobPaymentScreen({ jobId, stopId, onBack, onClose, onConfirmPayment, initialMethod }: CurrentJobPaymentScreenProps) {
  const detail = CURRENT_JOB_DETAILS[jobId] ?? CURRENT_JOB_DETAILS['job-1']
  const stop = detail.stops.find((entry) => entry.id === stopId) ?? detail.stops[0]
  const paymentOptions: Array<{ key: string; title: string; description?: string; value: string; icon?: string | null }> = [
    { key: 'cash', title: 'Cash', description: 'Collect on delivery', value: 'Collect on delivery', icon: null },
    { key: 'mobile', title: 'Mobile banking', description: 'Transfer using mobile banking', value: 'Mobile banking', icon: CURRENT_JOBS_PAYMENT_MOBILE_ICON },
    { key: 'qr', title: 'QR code', description: 'Scan to pay with QR code', value: 'QR code', icon: CURRENT_JOBS_PAYMENT_QR_ICON },
  ]
  const defaultOption =
    paymentOptions.find((option) => option.value === initialMethod) ??
    paymentOptions.find((option) => option.value === (stop.paymentInfo?.method ?? '').trim()) ??
    paymentOptions[0]
  const [selectedOptionKey, setSelectedOptionKey] = useState(defaultOption?.key ?? paymentOptions[0].key)

  const selectedOption = paymentOptions.find((option) => option.key === selectedOptionKey) ?? paymentOptions[0]

  return (
    <div className="current-job-payment-screen" role="presentation">
      <div className="current-job-payment-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>
      <header className="current-job-payment-header">
        <button type="button" className="current-job-payment-back" onClick={onBack} aria-label="Back to job detail">
          <img src={CURRENT_JOBS_BACK_ICON} alt="" aria-hidden="true" />
        </button>
        <h1>Payment</h1>
        <button type="button" className="current-job-payment-close" onClick={onClose} aria-label="Close">
          <img src={TERMS_CLOSE_ICON} alt="" aria-hidden="true" />
        </button>
      </header>

      <main className="current-job-payment-content">
        <section className="current-job-payment-options">
          <h2>Payment method</h2>
          <div className="current-job-payment-options__list">
            {paymentOptions.map((option) => {
              const isSelected = option.key === selectedOptionKey
              return (
                <button
                  type="button"
                  key={option.key}
                  className={`current-job-payment-option ${isSelected ? 'current-job-payment-option--selected' : ''}`}
                  onClick={() => setSelectedOptionKey(option.key)}
                >
                  <span
                    className={`current-job-payment-option__radio ${
                      isSelected ? 'current-job-payment-option__radio--selected' : ''
                    }`}
                    aria-hidden="true"
                  />
                  <div className="current-job-payment-option__details">
                    <strong>{option.title}</strong>
                    {option.description ? <span>{option.description}</span> : null}
                  </div>
                  {option.icon ? (
                    <span className="current-job-payment-option__icon" aria-hidden="true">
                      <img src={option.icon} alt="" />
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </section>
      </main>

      <footer className="current-job-payment-footer">
        <button
          type="button"
          className="current-job-payment-footer__cta"
          onClick={() => {
            onConfirmPayment(stop.id, selectedOption.value)
          }}
          disabled={!selectedOption}
        >
          Confirm payment
        </button>
      </footer>

      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

type CurrentJobUploadScreenProps = {
  jobId: string
  stopId: string
  checkedInStops: Record<string, boolean>
  isPaid: boolean
  onBack: () => void
  onClose: () => void
  existingPhoto: { url: string; name: string } | null
  onSubmitSop: (file: File) => Promise<void> | void
  onViewInfo: () => void
}

function CurrentJobUploadScreen({
  jobId,
  stopId,
  checkedInStops,
  isPaid,
  onBack,
  onClose,
  existingPhoto,
  onSubmitSop,
  onViewInfo,
}: CurrentJobUploadScreenProps) {
  const detail = CURRENT_JOB_DETAILS[jobId] ?? CURRENT_JOB_DETAILS['job-1']
  const stop = detail.stops.find((entry) => entry.id === stopId) ?? detail.stops[0]
  const isCheckedIn = Boolean(checkedInStops[stopId])
  const [showPhotoPicker, setShowPhotoPicker] = useState(false)
  const [selectedCargoPhoto, setSelectedCargoPhoto] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingPhoto?.url ?? null)
  const [photoName, setPhotoName] = useState<string>(existingPhoto?.name ?? '')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const confirmationStageLabel = isPaid ? 'POD' : 'SOP'
  const confirmCtaLabel = `Confirm ${confirmationStageLabel}`
  const confirmDialogTitle = `Confirm ${confirmationStageLabel} submission`
  const confirmDialogDescriptionPrefix = isPaid ? 'Proof of delivery' : 'SOP'

  useEffect(() => {
    if (!selectedCargoPhoto) {
      return
    }

    const url = URL.createObjectURL(selectedCargoPhoto)
    setPreviewUrl(url)
    setPhotoName(selectedCargoPhoto.name)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [selectedCargoPhoto])

  useEffect(() => {
    if (selectedCargoPhoto) {
      return
    }
    setPreviewUrl(existingPhoto?.url ?? null)
    setPhotoName(existingPhoto?.name ?? '')
  }, [existingPhoto, selectedCargoPhoto])

  const handleOpenPhotoPicker = () => {
    setShowPhotoPicker(true)
  }

  const handleClosePhotoPicker = () => {
    setShowPhotoPicker(false)
  }

  const handleGallerySelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    if (file) {
      setSelectedCargoPhoto(file)
    }
    setShowPhotoPicker(false)
    event.target.value = ''
  }

  const handleChooseFromGallery = () => {
    setShowPhotoPicker(false)
    fileInputRef.current?.click()
  }

  const handleConfirmSop = () => {
    if (!selectedCargoPhoto) {
      return
    }

    setShowConfirmDialog(true)
  }

  const handleCloseConfirmDialog = () => {
    setShowConfirmDialog(false)
  }

  const handleConfirmDialogConfirm = async () => {
    if (!selectedCargoPhoto) {
      setShowConfirmDialog(false)
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmitSop(selectedCargoPhoto)
      setShowConfirmDialog(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="current-job-upload-screen" role="presentation">
      <div className="current-job-update-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>
      <header className="current-job-update-header">
        <button type="button" className="current-job-update-back" onClick={onBack} aria-label="Back to job detail">
          <img src={CURRENT_JOBS_BACK_ICON} alt="" aria-hidden="true" />
        </button>
        <h1>{stop.title}</h1>
        <button type="button" className="current-job-update-close" onClick={onClose} aria-label="Back to home">
          <span />
        </button>
      </header>

      <main className="current-job-upload-content">
        {isCheckedIn ? (
          <div className="current-job-upload-success">
            <span className="current-job-upload-success__icon" aria-hidden="true">
              <img src={CURRENT_JOBS_SUCCESS_ICON} alt="" />
            </span>
            <div>
              <p>Checked in successfully</p>
              <span>{stop.checkInValue ?? stop.scheduleValue}</span>
            </div>
          </div>
        ) : null}

        <section className="current-job-upload-dropzone" role="presentation">
          <header>
            <span>Upload cargo photo</span>
            <span aria-hidden="true">*</span>
          </header>
          <div
            className={`current-job-upload-dropzone__frame ${
              previewUrl ? 'current-job-upload-dropzone__frame--has-photo' : ''
            }`}
          >
            <button
              type="button"
              aria-label="Take or select cargo photo"
              onClick={handleOpenPhotoPicker}
            >
              {previewUrl ? (
                <div className="current-job-upload-preview" aria-label="Selected cargo photo">
                  <span className="current-job-upload-preview__check" aria-hidden="true">
                    <img src={CURRENT_JOBS_SUCCESS_ICON} alt="" />
                  </span>
                  <img src={previewUrl} alt="" />
                  <span className="current-job-upload-preview__overlay" aria-hidden="true" />
                  <span className="current-job-upload-preview__camera" aria-hidden="true">
                    <img src={CURRENT_JOBS_CAMERA_ICON} alt="" />
                  </span>
                  <span
                    className="current-job-upload-preview__text"
                    title={photoName || 'Tap to view photo'}
                  >
                    Tap to view photo
                  </span>
                </div>
              ) : (
                <>
                  <span>
                    <img src={CURRENT_JOBS_CAMERA_ICON} alt="" />
                  </span>
                  <p>
                    Tap to capture or choose
                    <br />
                    cargo photo
                  </p>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="current-job-upload-input"
              onChange={handleGallerySelect}
            />
          </div>
        </section>
        {previewUrl ? (
          <button type="button" className="current-job-upload-view-info" onClick={onViewInfo}>
            View info
          </button>
        ) : null}
      </main>

      <footer className="current-job-upload-footer">
        <button
          type="button"
          className={`current-job-upload-footer__cta ${
            selectedCargoPhoto && !isSubmitting ? '' : 'current-job-upload-footer__cta--disabled'
          }`}
          disabled={!selectedCargoPhoto || isSubmitting}
          onClick={handleConfirmSop}
        >
          <span aria-hidden="true">
            <img src={CURRENT_JOBS_BOX_ICON} alt="" />
          </span>
          {confirmCtaLabel}
        </button>
      </footer>

      {showPhotoPicker ? (
        <div
          className="current-job-upload-picker-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Select cargo photo source"
          onClick={handleClosePhotoPicker}
        >
          <div
            className="current-job-upload-picker"
            role="document"
            onClick={(event) => {
              event.stopPropagation()
            }}
          >
            <div className="current-job-upload-picker__options">
              <button
                type="button"
                className="current-job-upload-picker__option"
                onClick={handleClosePhotoPicker}
              >
                <span aria-hidden="true">
                  <img src={CURRENT_JOBS_PICKER_CAMERA_ICON} alt="" />
                </span>
                Take Photo
              </button>
              <button
                type="button"
                className="current-job-upload-picker__option current-job-upload-picker__option--gallery"
                onClick={handleChooseFromGallery}
              >
                <span aria-hidden="true">
                  <img src={CURRENT_JOBS_PICKER_GALLERY_ICON} alt="" />
                </span>
                Choose from Gallery
              </button>
            </div>
            <button
              type="button"
              className="current-job-upload-picker__cancel"
              onClick={handleClosePhotoPicker}
            >
              Cancel
            </button>
            <div className="home-indicator home-indicator--raised" aria-hidden="true">
              <span />
            </div>
          </div>
        </div>
      ) : null}

      {showConfirmDialog ? (
        <div
          className="current-job-upload-confirm-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={confirmDialogTitle}
        >
          <div className="current-job-upload-confirm" role="document">
            <div className="current-job-upload-confirm__icon" aria-hidden="true">
              <img src={CURRENT_JOBS_SOP_DIALOG_ICON} alt="" />
            </div>
            <div className="current-job-upload-confirm__title">{confirmDialogTitle}</div>
            <p className="current-job-upload-confirm__description">
              Do you want to confirm the {confirmDialogDescriptionPrefix} photo upload for this stop?
            </p>
            <div className="current-job-upload-confirm__actions">
              <button type="button" onClick={handleCloseConfirmDialog} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="button" onClick={handleConfirmDialogConfirm} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

type CurrentJobStopInfoScreenProps = {
  jobId: string
  stopId: string
  onBack: () => void
  onClose: () => void
  checkedInStops: Record<string, boolean>
  paidStops: Record<string, boolean>
  paymentMethodByStop: Record<string, string>
  submittedSop: Record<string, { url: string; name: string }>
  onViewExpenses: () => void
  onAddExpense: () => void
  onReportIssue?: () => void
}

function CurrentJobStopInfoScreen({
  jobId,
  stopId,
  onBack,
  onClose,
  checkedInStops,
  paidStops,
  paymentMethodByStop,
  submittedSop,
  onViewExpenses,
  onAddExpense,
  onReportIssue,
}: CurrentJobStopInfoScreenProps) {
  const detail = CURRENT_JOB_DETAILS[jobId] ?? CURRENT_JOB_DETAILS['job-1']
  const stop = detail.stops.find((entry) => entry.id === stopId) ?? detail.stops[0]
  const [showReportIssueModal, setShowReportIssueModal] = useState(false)
  const isCheckedIn = Boolean(checkedInStops[stop.id])
  const isPaid = Boolean(paidStops[stop.id])
  const sopEntry = submittedSop[stop.id] ?? null
  const paymentMethodLabel = paymentMethodByStop[stop.id] ?? stop.paymentInfo?.method ?? ''
  const paymentTimestamp = stop.paymentInfo?.timestamp ?? stop.checkInValue ?? stop.scheduleValue
  const podTimestamp = stop.podTimestamp ?? stop.paymentInfo?.timestamp ?? stop.scheduleValue
  const quickActions = [
    { key: 'view-expenses', icon: CURRENT_JOBS_VIEW_EXPENSES_ICON, label: 'View expenses', onClick: onViewExpenses },
    { key: 'add-expense', icon: CURRENT_JOBS_ADD_EXPENSE_ICON, label: 'Add expense', onClick: onAddExpense },
    {
      key: 'report-issue',
      icon: CURRENT_JOBS_REPORT_ISSUE_ICON,
      label: 'Report issue',
      onClick: () => setShowReportIssueModal(true),
    },
  ]

  type DetailRow =
    | { type: 'text'; key: string; label: string; value: string }
    | { type: 'map'; key: string; image: string; alt: string }

  const detailRows: DetailRow[] = [
    {
      type: 'text',
      key: 'contact',
      label: 'Contact',
      value: `${stop.contactName}${stop.contactRole ? ` (${stop.contactRole})` : ''}`,
    },
    {
      type: 'text',
      key: 'route',
      label: 'Route',
      value: stop.routeCode,
    },
  ]

  if (stop.address) {
    detailRows.push({
      type: 'text',
      key: 'address',
      label: 'Address',
      value: stop.address,
    })
  }

  if (stop.mapImage) {
    detailRows.push({
      type: 'map',
      key: 'map',
      image: stop.mapImage,
      alt: `${stop.title} map`,
    })
  }

  if (stop.productDescription ?? stop.cargo) {
    detailRows.push({
      type: 'text',
      key: 'cargo',
      label: 'Cargo',
      value: stop.productDescription ?? stop.cargo ?? '',
    })
  }

  if (stop.scheduleLabel && stop.scheduleValue) {
    detailRows.push({
      type: 'text',
      key: 'schedule',
      label: stop.scheduleLabel,
      value: stop.scheduleValue,
    })
  }

  if (stop.note) {
    detailRows.push({
      type: 'text',
      key: 'note',
      label: 'Note',
      value: stop.note,
    })
  }

  type StopInfoStatusItem =
    | { key: 'check-in'; title: string; timestamp?: string; completed: boolean }
    | {
        key: 'payment'
        title: string
        timestamp?: string
        completed: boolean
        payment: { method: string; amount: string }
      }
    | {
        key: 'pod'
        title: string
        timestamp?: string
        completed: boolean
        photo: { url: string; name: string } | null
      }

  const statusItems = [
    {
      key: 'check-in',
      title: isCheckedIn ? 'Checked in successfully' : 'Awaiting check-in',
      timestamp: stop.checkInValue ?? stop.scheduleValue,
      completed: isCheckedIn,
    },
    stop.paymentInfo
      ? {
          key: 'payment',
          title: isPaid ? 'Payment completed' : 'Awaiting payment',
          timestamp: paymentTimestamp,
          completed: isPaid,
          payment: {
            method: paymentMethodLabel || '—',
            amount: stop.paymentInfo.amount,
          },
        }
      : null,
    {
      key: 'pod',
      title: sopEntry ? 'POD success' : 'Awaiting POD confirmation',
      timestamp: podTimestamp,
      completed: Boolean(sopEntry),
      photo: sopEntry,
    },
  ].filter(Boolean) as StopInfoStatusItem[]

  return (
    <div className="current-job-stop-info-screen" role="presentation">
      <div className="current-job-update-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>
      <header className="current-job-stop-info-header">
        <button type="button" className="current-job-stop-info-back" onClick={onBack} aria-label="Back to job detail">
          <img src={CURRENT_JOBS_BACK_ICON} alt="" aria-hidden="true" />
        </button>
        <h1>{stop.title}</h1>
        <button type="button" className="current-job-stop-info-close" onClick={onClose} aria-label="Back to home">
          <span />
        </button>
      </header>

      <main className="current-job-stop-info-content">
        <div className="current-job-stop-info-actions">
          {quickActions.map((action) => (
            <button key={action.key} type="button" onClick={action.onClick}>
              <span aria-hidden="true">
                <img src={action.icon} alt="" />
              </span>
              {action.label}
            </button>
          ))}
        </div>

        <section className="current-job-stop-info-status">
          {statusItems.map((item) => (
            <article
              key={item.key}
              className={`current-job-stop-info-status__item ${
                item.completed ? 'current-job-stop-info-status__item--completed' : ''
              }`}
            >
              <span className="current-job-stop-info-status__icon" aria-hidden="true">
                {item.completed ? <img src={CURRENT_JOBS_SUCCESS_ICON} alt="" /> : <span />}
              </span>
              <div className="current-job-stop-info-status__body">
                <header>
                  <span>{item.title}</span>
                  {item.timestamp ? <time>{item.timestamp}</time> : null}
                </header>
                {item.key === 'payment' ? (
                  <div className="current-job-stop-info-status__payment">
                    <div>
                      <span>Method</span>
                      <strong>{item.payment.method}</strong>
                    </div>
                    <div>
                      <span>Amount</span>
                      <strong>{item.payment.amount}</strong>
                    </div>
                  </div>
                ) : null}
                {item.key === 'pod' && item.photo ? (
                  <div className="current-job-stop-info-status__photo">
                    <img src={item.photo.url} alt={item.photo.name} />
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </section>

        <section className="current-job-stop-info-details">
          {detailRows.map((row) =>
            row.type === 'text' ? (
              <div key={row.key} className="current-job-stop-info-detail">
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ) : (
              <div key={row.key} className="current-job-stop-info-detail current-job-stop-info-detail--map">
                <img src={row.image} alt={row.alt} />
              </div>
            ),
          )}
        </section>
      </main>

      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>

      <ReportIssueModal isOpen={showReportIssueModal} onClose={() => setShowReportIssueModal(false)} />
    </div>
  )
}

type CurrentJobExpensesScreenProps = {
  jobId: string
  stopId: string
  mode: 'view' | 'add'
  expenses: ExpenseEntry[]
  onBack: () => void
  onClose: () => void
  onSubmitExpense: (expense: Omit<ExpenseEntry, 'id' | 'jobId' | 'stopId'>) => void | Promise<void>
}

function CurrentJobExpensesScreen({ jobId, stopId, mode, expenses, onBack, onClose, onSubmitExpense }: CurrentJobExpensesScreenProps) {
  type ExpenseFormState = {
    id: string
    category: string
    amount: string
    receipts: Array<{ name: string; url: string }>
    errors: { category?: string; amount?: string; receipts?: string }
  }

  const createBlankForm = () => ({
    id: `expense-form-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    category: '',
    amount: '',
    receipts: [],
    errors: {},
  })

  const [activeMode, setActiveMode] = useState<'view' | 'add'>(mode)
  const [expenseForms, setExpenseForms] = useState<ExpenseFormState[]>([createBlankForm()])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmTotal, setConfirmTotal] = useState(0)
  const [pendingUploadFormId, setPendingUploadFormId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    setActiveMode(mode)
  }, [mode])

  const ensureAtLeastOneForm = useCallback(() => {
    setExpenseForms((current) => (current.length === 0 ? [createBlankForm()] : current))
  }, [])

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (activeMode === 'add') {
      ensureAtLeastOneForm()
    }
  }, [activeMode, ensureAtLeastOneForm])

  const headerTitle = activeMode === 'add' ? 'Add expense' : 'Expenses'
  const totalAmount = useMemo(
    () => expenses.reduce((sum, entry) => sum + (Number.isFinite(entry.amount) ? entry.amount : 0), 0),
    [expenses],
  )
  const formatCurrency = useCallback(
    (amount: number) => `฿ ${amount.toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
    [],
  )
  const handlePreviewReceipts = useCallback((urls: string[]) => {
    if (!urls.length) {
      return
    }
    const targetUrl = urls[0]
    window.open(targetUrl, '_blank', 'noopener')
  }, [])

  const hasExpenses = expenses.length > 0

  const handleFieldChange = (formId: string, field: 'category' | 'amount', value: string) => {
    setExpenseForms((current) =>
      current.map((form) =>
        form.id === formId
          ? {
              ...form,
              [field]: value,
              errors: { ...form.errors, [field]: undefined },
            }
          : form,
      ),
    )
  }

  const handleRemoveReceipt = (formId: string, receiptIndex: number) => {
    setExpenseForms((current) =>
      current.map((form) => {
        if (form.id !== formId) {
          return form
        }
        const nextReceipts = form.receipts.filter((_, index) => index !== receiptIndex)
        return {
          ...form,
          receipts: nextReceipts,
          errors: { ...form.errors, receipts: undefined },
        }
      }),
    )
  }

  const handleReceiptChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : []
    if (!files.length) {
      setPendingUploadFormId(null)
      return
    }

    const readAsDataUrl = (file: File) =>
      new Promise<{ name: string; url: string }>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve({ name: file.name, url: reader.result as string })
        reader.onerror = () => reject(reader.error)
        reader.readAsDataURL(file)
      })

    try {
      const previews = await Promise.all(files.map((file) => readAsDataUrl(file)))
      const targetId = pendingUploadFormId
      if (!targetId) {
        return
      }
      setExpenseForms((current) =>
        current.map((form) =>
          form.id === targetId
            ? {
                ...form,
                receipts: [...form.receipts, ...previews],
                errors: { ...form.errors, receipts: undefined },
              }
            : form,
        ),
      )
    } catch (error) {
      console.error('Failed to load receipt file', error)
    } finally {
      setPendingUploadFormId(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) {
      return
    }

    if (expenseForms.length === 0) {
      ensureAtLeastOneForm()
      return
    }

    const validatedForms = expenseForms.map((form) => {
      const formErrors: ExpenseFormState['errors'] = {}
      if (!form.category) {
        formErrors.category = 'Please select an expense category'
      }
      const parsedAmount = Number(form.amount)
      if (!form.amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        formErrors.amount = 'Please enter a valid amount'
      }
      if (form.receipts.length === 0) {
        formErrors.receipts = 'Please upload at least one receipt photo'
      }
      return {
        ...form,
        errors: formErrors,
      }
    })

    const hasErrors = validatedForms.some((form) => Object.keys(form.errors).length > 0)
    setExpenseForms(validatedForms)

    if (hasErrors) {
      setActiveMode('add')
      return
    }

    const totalAmount = validatedForms.reduce((sum, form) => sum + Number(form.amount || 0), 0)
    setConfirmTotal(totalAmount)
    setShowConfirmDialog(true)
  }

  const expenseKeyLabel = `Expense key ${jobId}-${stopId}`

  const handleConfirmDialogCancel = () => {
    if (isSubmitting) {
      return
    }
    setShowConfirmDialog(false)
  }

  const handleConfirmDialogConfirm = async () => {
    if (isSubmitting) {
      return
    }
    setIsSubmitting(true)
    try {
      for (const form of expenseForms) {
        await Promise.resolve(
          onSubmitExpense({
            title: form.category,
            category: form.category,
            amount: Number(form.amount),
            currency: 'THB',
            date: new Date().toISOString().slice(0, 10),
            description: '',
            receiptUrl: form.receipts[0]?.url,
            receiptUrls: form.receipts.map((entry) => entry.url),
          }),
        )
      }
      if (isMountedRef.current) {
        setExpenseForms([createBlankForm()])
        setActiveMode('view')
        setShowConfirmDialog(false)
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="current-job-expenses-screen" role="presentation">
      <div className="current-job-expenses-status-bar" aria-hidden="true">
        <span>9:41</span>
      </div>
      <header className="current-job-expenses-header">
        <button
          type="button"
          className="current-job-expenses-back"
          onClick={onBack}
          aria-label="Go back"
        >
          <img src={CURRENT_JOBS_BACK_ICON} alt="" aria-hidden="true" />
        </button>
        <h1>{headerTitle}</h1>
        <button type="button" className="current-job-expenses-close" onClick={onClose} aria-label="Return to home">
          <span />
        </button>
      </header>

      {activeMode === 'add' ? (
        <div className="current-job-expenses-tabs" role="tablist" aria-label="Expense view mode">
          <button
            type="button"
            role="tab"
            aria-selected={false}
            onClick={() => setActiveMode('view')}
          >
            View expenses
          </button>
          <button
            type="button"
            role="tab"
            aria-selected
            className="active"
            onClick={() => {
              setActiveMode('add')
              ensureAtLeastOneForm()
            }}
          >
            Add expense
          </button>
        </div>
      ) : null}

      <main className="current-job-expenses-content">
        {activeMode === 'view' ? (
          <section className="current-job-expenses-overview" aria-label="Expense list">
            <div className="current-job-expenses-summary">
              <div className="current-job-expenses-summary__icon" aria-hidden="true">
                <img src={CURRENT_JOB_EXPENSES_COINS_ICON} alt="" />
              </div>
              <div className="current-job-expenses-summary__content">
                <span>Total expenses</span>
                <strong>{formatCurrency(totalAmount)}</strong>
              </div>
            </div>

            {hasExpenses ? (
              <ul className="current-job-expenses-cards">
                {expenses.map((item) => {
                  const receiptUrls =
                    item.receiptUrls?.length && item.receiptUrls[0]
                      ? item.receiptUrls
                      : item.receiptUrl
                      ? [item.receiptUrl]
                      : []
                  const hasReceipt = receiptUrls.length > 0
                  const coverStyle = hasReceipt ? { backgroundImage: `url(${receiptUrls[0]})` } : undefined

                  return (
                    <li key={item.id} className="current-job-expenses-card">
                      <div className="current-job-expenses-card__header">
                        <span className="current-job-expenses-card__label">{item.title || item.category}</span>
                        <span className="current-job-expenses-card__amount">{formatCurrency(item.amount)}</span>
                      </div>
                      <button
                        type="button"
                        className={`current-job-expenses-card__receipt${hasReceipt ? '' : ' current-job-expenses-card__receipt--empty'}`}
                        onClick={() => handlePreviewReceipts(receiptUrls)}
                        disabled={!hasReceipt}
                      >
                        <div
                          className="current-job-expenses-card__receipt-cover"
                          style={coverStyle}
                          aria-hidden="true"
                        >
                          <span />
                        </div>
                        <span className="current-job-expenses-card__receipt-text">Tap to view receipt</span>
                        <span className="current-job-expenses-card__receipt-icon" aria-hidden="true">
                          <img src={CURRENT_JOBS_CAMERA_ICON} alt="" />
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="current-job-expenses-empty current-job-expenses-empty--view">
                <p>No expenses for this stop yet.</p>
                <button
                  type="button"
                  className="current-job-expenses-empty__cta"
                  onClick={() => {
                    setActiveMode('add')
                    ensureAtLeastOneForm()
                  }}
                >
                  Add first expense
                </button>
              </div>
            )}

            <div className="current-job-expenses-view-footer">
              <button
                type="button"
                onClick={() => {
                  setActiveMode('add')
                  ensureAtLeastOneForm()
                }}
              >
                Add expense
              </button>
            </div>
          </section>
        ) : (
          <form className="current-job-expenses-form" onSubmit={handleSubmit} noValidate>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="current-job-expenses-upload__input"
              onChange={handleReceiptChange}
            />
            {expenseForms.map((form, index) => (
              <section
                key={form.id}
                className="current-job-expenses-section"
                aria-labelledby={`expense-section-${form.id}`}
              >
                <header>
                  <h2 id={`expense-section-${form.id}`}>Expense {index + 1}</h2>
                  <span className="current-job-expenses-section__caption">
                    {expenseKeyLabel}-{index + 1}
                  </span>
                </header>

                <div className={`current-job-expenses-field${form.errors.category ? ' current-job-expenses-field--error' : ''}`}>
                  <label htmlFor={`expense-category-${form.id}`}>
                    Expense category <span aria-hidden="true">*</span>
                  </label>
                  <select
                    id={`expense-category-${form.id}`}
                    value={form.category}
                    onChange={(event) => handleFieldChange(form.id, 'category', event.target.value)}
                    required
                  >
                    <option value="">Select expense category</option>
                    <option value="Fuel">Fuel</option>
                    <option value="Loading services">Loading services</option>
                    <option value="Permits">Permits</option>
                    <option value="Toll fees">Toll fees</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                  {form.errors.category ? (
                    <span className="current-job-expenses-field__error">{form.errors.category}</span>
                  ) : null}
                </div>

                <div className={`current-job-expenses-field${form.errors.amount ? ' current-job-expenses-field--error' : ''}`}>
                  <label htmlFor={`expense-amount-${form.id}`}>
                    Amount <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id={`expense-amount-${form.id}`}
                    type="number"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(event) => handleFieldChange(form.id, 'amount', event.target.value)}
                    min="0"
                    step="0.01"
                    required
                  />
                  {form.errors.amount ? (
                    <span className="current-job-expenses-field__error">{form.errors.amount}</span>
                  ) : null}
                </div>

                <div className={`current-job-expenses-upload${form.errors.receipts ? ' current-job-expenses-upload--error' : ''}`}>
                  <div className="current-job-expenses-upload__label">
                    <span>
                      Upload receipt <span aria-hidden="true">*</span>
                    </span>
                    {form.receipts.length ? (
                      <span className="current-job-expenses-upload__count">
                        {form.receipts.length} photo{form.receipts.length > 1 ? 's' : ''} added
                      </span>
                    ) : null}
                  </div>
                  <div
                    className={`current-job-expenses-upload__grid${
                      form.receipts.length === 0 ? ' current-job-expenses-upload__grid--empty' : ''
                    }`}
                  >
                    {form.receipts.length === 0 ? (
                      <button
                        type="button"
                        className="current-job-expenses-upload__frame"
                        onClick={() => {
                          setPendingUploadFormId(form.id)
                          fileInputRef.current?.click()
                        }}
                        aria-label="Upload receipt photo"
                      >
                        <span className="current-job-expenses-upload__icon" aria-hidden="true">
                          <img src={CURRENT_JOBS_CAMERA_ICON} alt="" />
                        </span>
                        <p>Tap to capture or choose a receipt photo</p>
                      </button>
                    ) : (
                      <>
                        {form.receipts.map((receipt, receiptIndex) => (
                          <div
                            className="current-job-expenses-upload__preview"
                            key={`${form.id}-receipt-${receiptIndex}`}
                          >
                            <img src={receipt.url} alt={receipt.name} />
                            <button
                              type="button"
                              className="current-job-expenses-upload__remove"
                              onClick={() => handleRemoveReceipt(form.id, receiptIndex)}
                              aria-label="Remove receipt photo"
                            >
                              <span aria-hidden="true">×</span>
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="current-job-expenses-upload__add"
                          onClick={() => {
                            setPendingUploadFormId(form.id)
                            fileInputRef.current?.click()
                          }}
                          aria-label="Add another receipt photo"
                        >
                          <span className="current-job-expenses-upload__add-icon" aria-hidden="true">
                            <img src={CURRENT_JOBS_ADD_EXPENSE_ICON} alt="" />
                          </span>
                          <span>Add photo</span>
                        </button>
                      </>
                    )}
                  </div>
                  {form.errors.receipts ? (
                    <span className="current-job-expenses-field__error current-job-expenses-field__error--block">
                      {form.errors.receipts}
                    </span>
                  ) : null}
                </div>
              </section>
            ))}

            <button
              type="button"
              className="current-job-expenses-secondary"
              onClick={() => {
                const currentMode = activeMode as 'view' | 'add'
                if (currentMode === 'view') {
                  setActiveMode('add')
                  ensureAtLeastOneForm()
                  return
                }
                setExpenseForms((current) => [...current, createBlankForm()])
              }}
            >
              <img src={CURRENT_JOBS_ADD_EXPENSE_ICON} alt="" aria-hidden="true" />
              {activeMode === 'add' ? 'Add another expense' : 'Add new expense'}
            </button>

            <div className="current-job-expenses-footer">
              <button type="submit" className="current-job-expenses-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Add expense'}
              </button>
            </div>
          </form>
        )}
      </main>

      {showConfirmDialog ? (
        <div className="current-job-expenses-confirm-overlay" role="dialog" aria-modal="true">
          <div className="current-job-expenses-confirm">
            <div className="current-job-expenses-confirm__icon" aria-hidden="true">
              <img src={CURRENT_JOB_EXPENSES_CONFIRM_ICON} alt="" />
            </div>
            <div className="current-job-expenses-confirm__content">
              <h2>Confirm expense submission</h2>
              <p>Total amount</p>
              <strong>{`THB ${confirmTotal.toLocaleString('en-US')}`}</strong>
              <span>Please review the details before continuing.</span>
            </div>
            <div className="current-job-expenses-confirm__actions">
              <button type="button" onClick={handleConfirmDialogCancel} disabled={isSubmitting}>
                Cancel
              </button>
              <button
                type="button"
                className="current-job-expenses-confirm__confirm"
                onClick={handleConfirmDialogConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

type SettingsScreenProps = {
  onBack: () => void
  onSelectTab: (tab: BottomNavTab) => void
  onLogout: () => void
  onOpenProfile: () => void
  onOpenAccount: () => void
  onOpenVehicleInformation: () => void
  onOpenTermsOfService: () => void
}

function SettingsScreen({ onBack, onSelectTab, onLogout, onOpenProfile, onOpenAccount, onOpenVehicleInformation, onOpenTermsOfService }: SettingsScreenProps) {
  const { t } = useTranslation()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogout = () => {
    setShowLogoutDialog(false)
    onLogout()
  }

  return (
    <div className="settings-screen" role="presentation">
      <div className="settings-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>
      <header className="settings-header">
        <button type="button" className="settings-back" onClick={onBack} aria-label={t('common.back')}>
          <img src={SETTINGS_BACK_ICON} alt="" aria-hidden="true" />
        </button>
        <h1>{t('settings.title')}</h1>
        <div className="settings-header-spacer" />
      </header>

      <main className="settings-content">
        <div className="settings-section">
          <button type="button" className="settings-profile-row" onClick={onOpenProfile}>
            <span className="settings-profile-label">{t('settings.profile')}</span>
            <img src={SETTINGS_NEXT_ICON} alt="" className="settings-next-icon" aria-hidden="true" />
          </button>
        </div>

        <div className="settings-section">
          <h2 className="settings-section-title">{t('profile.title')}</h2>
          <button type="button" className="settings-row" onClick={onOpenAccount}>
            <img src={SETTINGS_PROFILE_ICON} alt="" className="settings-row-icon" aria-hidden="true" />
            <span className="settings-row-label">{t('settings.account')}</span>
            <img src={SETTINGS_NEXT_ICON} alt="" className="settings-next-icon" aria-hidden="true" />
          </button>
          <button type="button" className="settings-row" onClick={onOpenVehicleInformation}>
            <img src={SETTINGS_DELIVERY_ICON} alt="" className="settings-row-icon" aria-hidden="true" />
            <span className="settings-row-label">{t('vehicles.vehicleInfo')}</span>
            <img src={SETTINGS_NEXT_ICON} alt="" className="settings-next-icon" aria-hidden="true" />
          </button>
        </div>

        <div className="settings-section">
          <h2 className="settings-section-title">{t('settings.notifications')}</h2>
          <div className="settings-row settings-row--toggle">
            <img src={SETTINGS_ACTIVITY_ICON} alt="" className="settings-row-icon" aria-hidden="true" />
            <span className="settings-row-label">{t('settings.notifications')}</span>
            <span className="settings-toggle-label">{notificationsEnabled ? t('chat.unmuteNotifications') : t('chat.muteNotifications')}</span>
            <button
              type="button"
              className={`settings-toggle${notificationsEnabled ? ' settings-toggle--active' : ''}`}
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              aria-label={notificationsEnabled ? t('chat.muteNotifications') : t('chat.unmuteNotifications')}
              aria-pressed={notificationsEnabled}
            >
              <span className="settings-toggle-indicator" />
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="settings-section-title">{t('settings.about')}</h2>
          <div className="settings-row settings-row--language">
            <img src={SETTINGS_LANGUAGE_ICON} alt="" className="settings-row-icon" aria-hidden="true" />
            <span className="settings-row-label">{t('settings.language')}</span>
            <LanguageSwitcher />
          </div>
          <button type="button" className="settings-row" onClick={onOpenTermsOfService}>
            <img src={SETTINGS_INFO_ICON} alt="" className="settings-row-icon" aria-hidden="true" />
            <span className="settings-row-label">{t('settings.terms')}</span>
            <img src={SETTINGS_NEXT_ICON} alt="" className="settings-next-icon" aria-hidden="true" />
          </button>
          <button type="button" className="settings-row">
            <img src={SETTINGS_QUESTION_ICON} alt="" className="settings-row-icon" aria-hidden="true" />
            <span className="settings-row-label">{t('settings.help')}</span>
            <img src={SETTINGS_NEXT_ICON} alt="" className="settings-next-icon" aria-hidden="true" />
          </button>
        </div>

        <div className="settings-section settings-section--logout">
          <button
            type="button"
            className="settings-logout-button"
            onClick={() => setShowLogoutDialog(true)}
          >
            {t('settings.logout')}
          </button>
        </div>
      </main>

      {showLogoutDialog ? (
        <div className="settings-logout-overlay" onClick={() => setShowLogoutDialog(false)}>
          <div className="settings-logout-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="settings-logout-dialog__content">
              <div className="settings-logout-dialog__icon">
                <img src={SETTINGS_LOGOUT_POWER_ICON} alt="" />
              </div>
              <h2 className="settings-logout-dialog__title">{t('settings.confirmLogout')}</h2>
              <p className="settings-logout-dialog__description">
                {t('settings.confirmLogout')}
              </p>
            </div>
            <div className="settings-logout-dialog__actions">
              <button
                type="button"
                className="settings-logout-dialog__button settings-logout-dialog__button--primary"
                onClick={handleLogout}
              >
                {t('settings.logout')}
              </button>
              <button
                type="button"
                className="settings-logout-dialog__button settings-logout-dialog__button--secondary"
                onClick={() => setShowLogoutDialog(false)}
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <BottomNav active="settings" onSelect={onSelectTab} />

      <div className="home-indicator" aria-hidden="true">
        <img src={SETTINGS_HOME_INDICATOR} alt="" />
      </div>
    </div>
  )
}

type ProfileScreenProps = {
  onBack: () => void
  onEdit: () => void
  profileData: InfoFormData
  avatarPreview: string | null
  onAvatarSelect: (file: File | null) => void
}

function ProfileScreen({ onBack, onEdit, profileData, avatarPreview, onAvatarSelect }: ProfileScreenProps) {
  const preferredLocations = profileData.region ? profileData.region.split(',').map((loc) => loc.trim()).filter(Boolean) : []

  return (
    <div className="profile-screen" role="presentation">
      <div className="profile-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>
      <header className="profile-header">
        <button type="button" className="profile-back" onClick={onBack} aria-label="Back">
          <img src={SETTINGS_BACK_ICON} alt="" aria-hidden="true" />
        </button>
        <h1>Profile</h1>
        <div className="profile-header-spacer" />
      </header>

      <main className="profile-content">
        <div className="profile-banner">
          <div className="profile-banner-bg" style={{ backgroundImage: `url(${PROFILE_BANNER_BG})` }} />
          <div className="profile-avatar-container">
            <img
              src={avatarPreview || PROFILE_AVATAR_IMAGE}
              alt="Profile"
              className="profile-avatar"
            />
            <button
              type="button"
              className="profile-avatar-edit"
              onClick={onEdit}
              aria-label="Edit profile"
            >
              <img src={PROFILE_EDIT_ICON} alt="" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="profile-form">
          <div className="profile-field">
            <label>Name</label>
            <div className="profile-field-row">
              <input
                type="text"
                value={profileData.firstName}
                readOnly
                disabled
                placeholder="Enter name"
              />
              <button
                type="button"
                className="profile-edit-button"
                onClick={onEdit}
                aria-label="Edit name"
              >
                <img src={PROFILE_EDIT_ICON} alt="" className="profile-edit-icon" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="profile-field">
            <label>Last Name</label>
            <div className="profile-field-row">
              <input
                type="text"
                value={profileData.lastName}
                readOnly
                disabled
                placeholder="Enter last name"
              />
              <button
                type="button"
                className="profile-edit-button"
                onClick={onEdit}
                aria-label="Edit last name"
              >
                <img src={PROFILE_EDIT_ICON} alt="" className="profile-edit-icon" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="profile-field">
            <label>Phone Number</label>
            <div className="profile-field-row">
              <input
                type="tel"
                value={profileData.phone}
                readOnly
                disabled
                placeholder="Enter phone number"
              />
              <button
                type="button"
                className="profile-edit-button"
                onClick={onEdit}
                aria-label="Edit phone number"
              >
                <img src={PROFILE_EDIT_ICON} alt="" className="profile-edit-icon" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="profile-field">
            <label>Email</label>
            <div className="profile-field-row">
              <input
                type="email"
                value={profileData.email}
                readOnly
                disabled
                placeholder="Enter email"
              />
              <button
                type="button"
                className="profile-edit-button"
                onClick={onEdit}
                aria-label="Edit email"
              >
                <img src={PROFILE_EDIT_ICON} alt="" className="profile-edit-icon" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="profile-field">
            <label>District or Province where you are proficient or regularly work</label>
            <div className="profile-locations">
              {preferredLocations.length > 0 ? (
                preferredLocations.map((location, index) => (
                  <span key={index} className="profile-location-tag">
                    {location}
                  </span>
                ))
              ) : (
                <span className="profile-locations-empty">No locations selected</span>
              )}
            </div>
          </div>

          <div className="profile-field">
            <label>Work Rate Price (฿)</label>
            <div className="profile-field-row">
              <input
                type="text"
                value={profileData.rateMin && profileData.rateMax ? `${profileData.rateMin} - ${profileData.rateMax}` : `${profileData.rateMin || ''}${profileData.rateMin && profileData.rateMax ? ' - ' : ''}${profileData.rateMax || ''}`}
                readOnly
                disabled
                placeholder="e.g., 1,000 - 10,000"
              />
              <button
                type="button"
                className="profile-edit-button"
                onClick={onEdit}
                aria-label="Edit work rate"
              >
                <img src={PROFILE_EDIT_ICON} alt="" className="profile-edit-icon" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

type ProfileEditScreenProps = {
  onBack: () => void
  onSave: () => void
  profileData: InfoFormData
  onProfileChange: (field: keyof InfoFormData, value: string) => void
  avatarPreview: string | null
  onAvatarSelect: (file: File | null) => void
}

function ProfileEditScreen({ onBack, onSave, profileData, onProfileChange, avatarPreview, onAvatarSelect }: ProfileEditScreenProps) {
  const preferredLocations = profileData.region ? profileData.region.split(',').map((loc) => loc.trim()).filter(Boolean) : []
  const fileInputRef = useRef<HTMLInputElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const lastNameInputRef = useRef<HTMLInputElement>(null)
  const phoneInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const rateInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    onAvatarSelect(file)
  }

  const handleEditClick = (inputRef: React.RefObject<HTMLInputElement>) => {
    inputRef.current?.focus()
  }

  return (
    <div className="profile-screen" role="presentation">
      <div className="profile-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>
      <header className="profile-header">
        <button type="button" className="profile-back" onClick={onBack} aria-label="Back">
          <img src={SETTINGS_BACK_ICON} alt="" aria-hidden="true" />
        </button>
        <h1>Edit Profile</h1>
        <div className="profile-header-spacer" />
      </header>

      <main className="profile-content">
        <div className="profile-banner">
          <div className="profile-banner-bg" style={{ backgroundImage: `url(${PROFILE_BANNER_BG})` }} />
          <div className="profile-avatar-container">
            <img
              src={avatarPreview || PROFILE_AVATAR_IMAGE}
              alt="Profile"
              className="profile-avatar"
            />
            <button
              type="button"
              className="profile-avatar-edit"
              onClick={handleAvatarClick}
              aria-label="Change profile picture"
            >
              <img src={PROFILE_EDIT_ICON} alt="" aria-hidden="true" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="profile-avatar-input"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="profile-form">
          <div className="profile-field">
            <label>Name</label>
            <div className="profile-field-row">
              <input
                ref={nameInputRef}
                type="text"
                value={profileData.firstName}
                onChange={(e) => onProfileChange('firstName', e.target.value)}
                placeholder="Enter name"
              />
              <button
                type="button"
                className="profile-clear-button"
                onClick={() => onProfileChange('firstName', '')}
                aria-label="Clear name"
              >
                <img src={TERMS_CLOSE_ICON} alt="" className="profile-clear-icon" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="profile-field">
            <label>Last Name</label>
            <div className="profile-field-row">
              <input
                ref={lastNameInputRef}
                type="text"
                value={profileData.lastName}
                onChange={(e) => onProfileChange('lastName', e.target.value)}
                placeholder="Enter last name"
              />
              <button
                type="button"
                className="profile-clear-button"
                onClick={() => onProfileChange('lastName', '')}
                aria-label="Clear last name"
              >
                <img src={TERMS_CLOSE_ICON} alt="" className="profile-clear-icon" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="profile-field">
            <label>Phone Number</label>
            <div className="profile-field-row">
              <input
                ref={phoneInputRef}
                type="tel"
                value={profileData.phone}
                onChange={(e) => onProfileChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
              <button
                type="button"
                className="profile-clear-button"
                onClick={() => onProfileChange('phone', '')}
                aria-label="Clear phone number"
              >
                <img src={TERMS_CLOSE_ICON} alt="" className="profile-clear-icon" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="profile-field">
            <label>Email</label>
            <div className="profile-field-row">
              <input
                ref={emailInputRef}
                type="email"
                value={profileData.email}
                onChange={(e) => onProfileChange('email', e.target.value)}
                placeholder="Enter email"
              />
              <button
                type="button"
                className="profile-clear-button"
                onClick={() => onProfileChange('email', '')}
                aria-label="Clear email"
              >
                <img src={TERMS_CLOSE_ICON} alt="" className="profile-clear-icon" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="profile-field">
            <label>District or Province where you are proficient or regularly work</label>
            <div className="profile-locations">
              {preferredLocations.length > 0 ? (
                preferredLocations.map((location, index) => (
                  <span key={index} className="profile-location-tag">
                    {location}
                  </span>
                ))
              ) : (
                <span className="profile-locations-empty">No locations selected</span>
              )}
            </div>
          </div>

          <div className="profile-field">
            <label>Work Rate Price (฿)</label>
            <div className="profile-field-row">
              <input
                ref={rateInputRef}
                type="text"
                value={profileData.rateMin && profileData.rateMax ? `${profileData.rateMin} - ${profileData.rateMax}` : `${profileData.rateMin || ''}${profileData.rateMin && profileData.rateMax ? ' - ' : ''}${profileData.rateMax || ''}`}
                onChange={(e) => {
                  const value = e.target.value
                  const parts = value.split(/\s*-\s*/)
                  if (parts.length === 2) {
                    onProfileChange('rateMin', parts[0].replace(/,/g, '').trim())
                    onProfileChange('rateMax', parts[1].replace(/,/g, '').trim())
                  } else if (parts.length === 1) {
                    if (value.includes('-')) {
                      // User is typing the dash, keep both values
                    } else {
                      // Only one value entered, assume it's min
                      const numValue = value.replace(/,/g, '').trim()
                      if (numValue) {
                        onProfileChange('rateMin', numValue)
                      } else {
                        onProfileChange('rateMin', '')
                        onProfileChange('rateMax', '')
                      }
                    }
                  }
                }}
                placeholder="e.g., 1,000 - 10,000"
              />
              <button
                type="button"
                className="profile-clear-button"
                onClick={() => {
                  onProfileChange('rateMin', '')
                  onProfileChange('rateMax', '')
                }}
                aria-label="Clear work rate"
              >
                <img src={TERMS_CLOSE_ICON} alt="" className="profile-clear-icon" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="profile-save-container">
          <button type="button" className="profile-save-button" onClick={onSave}>
            Save
          </button>
        </div>
      </main>

      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

type AccountScreenProps = {
  onBack: () => void
  onEditPassword: () => void
  onDeleteAccount: () => void
  username?: string
}

function AccountScreen({ onBack, onEditPassword, onDeleteAccount, username = 'pattharida.2024' }: AccountScreenProps) {
  return (
    <div className="settings-screen" role="presentation">
      <div className="settings-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>
      <header className="settings-header">
        <button type="button" className="settings-back" onClick={onBack} aria-label="Back">
          <img 
            src={SETTINGS_BACK_ICON} 
            alt="" 
            aria-hidden="true" 
            onLoad={(e) => {
              const fallback = e.currentTarget.parentElement?.querySelector('.settings-back-fallback') as HTMLElement;
              if (fallback) fallback.style.display = 'none';
            }}
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const fallback = target.parentElement?.querySelector('.settings-back-fallback') as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <span className="settings-back-fallback" aria-hidden="true">←</span>
        </button>
        <h1>Account</h1>
        <div className="settings-header-spacer" />
      </header>

      <main className="settings-content">
        <div className="settings-section">
          <div className="account-field">
            <label className="account-field-label">Username</label>
            <div className="account-field-row">
              <span className="account-field-value">{username}</span>
            </div>
          </div>

          <div className="account-field">
            <label className="account-field-label">Password</label>
            <div className="account-field-row">
              <span className="account-field-value">**********</span>
              <button
                type="button"
                className="account-edit-button"
                onClick={onEditPassword}
                aria-label="Edit password"
              >
                <img src={PROFILE_EDIT_ICON} alt="" className="account-edit-icon" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="account-delete-container">
            <button type="button" className="account-delete-button" onClick={onDeleteAccount}>
              Delete Account
            </button>
          </div>
        </div>
      </main>

      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

type AccountEditPasswordScreenProps = {
  onBack: () => void
  onSave: () => void
}

function AccountEditPasswordScreen({ onBack, onSave }: AccountEditPasswordScreenProps) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isFocused, setIsFocused] = useState<'new' | 'confirm' | null>('new')
  const newPasswordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword
  const hasError = confirmPassword && newPassword && !passwordsMatch
  const isButtonEnabled = newPassword && confirmPassword && passwordsMatch

  const handleClearNewPassword = () => {
    setNewPassword('')
    newPasswordRef.current?.focus()
  }

  const handleClearConfirmPassword = () => {
    setConfirmPassword('')
    confirmPasswordRef.current?.focus()
  }

  const handleSave = () => {
    if (isButtonEnabled) {
      // Save password logic here
      onSave()
    }
  }

  return (
    <div className="settings-screen" role="presentation">
      <div className="settings-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>
      <header className="settings-header">
        <button type="button" className="settings-back" onClick={onBack} aria-label="Back">
          <img src={SETTINGS_BACK_ICON} alt="" aria-hidden="true" />
        </button>
        <h1>Change Password</h1>
        <div className="settings-header-spacer" />
      </header>

      <main className="settings-content">
        <div className="settings-section">
          <div className="account-edit-password-field">
            <label className="account-edit-password-label">New Password</label>
            <div className={`account-edit-password-input-container ${isFocused === 'new' ? 'account-edit-password-input-container--active' : ''}`}>
              <input
                ref={newPasswordRef}
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={() => setIsFocused('new')}
                onBlur={() => setIsFocused(null)}
                placeholder=""
                className="account-edit-password-input"
              />
              {newPassword && (
                <button
                  type="button"
                  className="account-edit-password-clear"
                  onClick={handleClearNewPassword}
                  aria-label="Clear"
                >
                  <img src={TERMS_CLOSE_ICON} alt="" className="account-edit-password-clear-icon" aria-hidden="true" />
                </button>
              )}
              {newPassword && (
                <button
                  type="button"
                  className="account-edit-password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {showNewPassword ? (
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#4C4C4C"/>
                    ) : (
                      <>
                        <path d="M12 7c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5zm1.83 6.5c.25-.25.25-.66 0-.91l-1.41-1.41c-.25-.25-.66-.25-.91 0l-1.41 1.41c-.25.25-.25.66 0 .91l1.41 1.41c.25.25.66.25.91 0l1.41-1.41z" fill="#4C4C4C"/>
                        <path d="M1 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 2.27 2 1 3.27zM5.07 8.6l1.43 1.43C6.36 9.68 6 10.31 6 11c0 1.66 1.34 3 3 3 .69 0 1.32-.36 1.75-.97l1.43 1.43C11.26 16.06 10.7 16.5 10 16.5c-2.76 0-5-2.24-5-5 0-.7.44-1.26 1.07-1.9z" fill="#4C4C4C"/>
                      </>
                    )}
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="account-edit-password-field">
            <label className="account-edit-password-label">Confirm Password</label>
            <div className={`account-edit-password-input-container ${isFocused === 'confirm' ? 'account-edit-password-input-container--active' : ''}`}>
              <input
                ref={confirmPasswordRef}
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setIsFocused('confirm')}
                onBlur={() => setIsFocused(null)}
                placeholder="Confirm Password"
                className="account-edit-password-input"
              />
              {confirmPassword && (
                <button
                  type="button"
                  className="account-edit-password-clear"
                  onClick={handleClearConfirmPassword}
                  aria-label="Clear"
                >
                  <img src={TERMS_CLOSE_ICON} alt="" className="account-edit-password-clear-icon" aria-hidden="true" />
                </button>
              )}
              {confirmPassword && (
                <button
                  type="button"
                  className="account-edit-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {showConfirmPassword ? (
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#4C4C4C"/>
                    ) : (
                      <>
                        <path d="M12 7c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5zm1.83 6.5c.25-.25.25-.66 0-.91l-1.41-1.41c-.25-.25-.66-.25-.91 0l-1.41 1.41c-.25.25-.25.66 0 .91l1.41 1.41c.25.25.66.25.91 0l1.41-1.41z" fill="#4C4C4C"/>
                        <path d="M1 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 2.27 2 1 3.27zM5.07 8.6l1.43 1.43C6.36 9.68 6 10.31 6 11c0 1.66 1.34 3 3 3 .69 0 1.32-.36 1.75-.97l1.43 1.43C11.26 16.06 10.7 16.5 10 16.5c-2.76 0-5-2.24-5-5 0-.7.44-1.26 1.07-1.9z" fill="#4C4C4C"/>
                      </>
                    )}
                  </svg>
                </button>
              )}
            </div>
          </div>

          {hasError && (
            <div className="account-edit-password-error">
              Passwords do not match
            </div>
          )}

          <div className="account-edit-password-save-container">
            <button
              type="button"
              className={`account-edit-password-save-button ${isButtonEnabled ? 'account-edit-password-save-button--enabled' : ''}`}
              onClick={handleSave}
              disabled={!isButtonEnabled}
            >
              Use this password
            </button>
          </div>
        </div>
      </main>

      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

type FinancialPeriod = 'day' | 'month' | 'year'
type TransportationSegment = 'international' | 'domestic'
type TransportationJobStatus = 'inProgress' | 'waiting'

const FINANCIAL_PERIOD_CONFIG: Record<FinancialPeriod, { label: string; points: number }> = {
  day: { label: 'Day', points: 7 },
  month: { label: 'Month', points: 6 },
  year: { label: 'Year', points: 5 },
}

const DEFAULT_FINANCIAL_BASE_DATE = new Date(2024, 0, 15)
const DEFAULT_FINANCIAL_DATE_INPUT = formatDateToInputValue(DEFAULT_FINANCIAL_BASE_DATE)
const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 })

const TRANSPORTATION_SEGMENTS: Array<{ label: string; helper: string; value: TransportationSegment }> = [
  { label: 'International', helper: 'Cross-border loads', value: 'international' },
  { label: 'Domestic', helper: 'Single & multi-stop', value: 'domestic' },
]

type TransportationStopField = {
  label: string
  value: string
}

type TransportationTimelineStop = {
  id: string
  title: string
  icon: 'check' | 'location'
  tag: {
    label: string
    tone: 'sop' | 'pod'
  }
  fields: TransportationStopField[]
}

type TransportationJobDetailData = {
  client: string
  stops: TransportationTimelineStop[]
}

type TransportationDirection = 'inbound' | 'outbound'

type TransportationJob = {
  id: string
  code: string
  date: string
  time: string
  employer: string
  segment: TransportationSegment
  service: string
  description: string
  budget: string
  status: TransportationJobStatus
  direction: TransportationDirection
  route: {
    origin: string
    destination: string
  }
  equipment?: string
  contact?: {
    name: string
    role: string
    phone: string
  }
  detail?: TransportationJobDetailData
}

const TRANSPORTATION_DETAIL_SAMPLE: TransportationJobDetailData = {
  client: 'Thai PM Charter Co., Ltd.',
  stops: [
    {
      id: 'pickup-1',
      title: 'Pickup · Factory 1',
      icon: 'check',
      tag: { label: 'SOP Completed', tone: 'sop' },
      fields: [
        { label: 'Contact', value: 'Nattapong (Warehouse lead)' },
        { label: 'Route', value: 'BKK001 Lat Phrao / Bangkok' },
        { label: 'Goods', value: 'Refined sugar (30 cartons)' },
        { label: 'Slot', value: '15 Aug 2025 · 09:00' },
        { label: 'Notes', value: 'ID badge required for entry' },
      ],
    },
    {
      id: 'dropoff-1',
      title: 'Drop-off · Chai Sugar Trading',
      icon: 'check',
      tag: { label: 'POD Completed', tone: 'pod' },
      fields: [
        { label: 'Contact', value: 'Khun Chai' },
        { label: 'Route', value: 'SAM001 Mueang / Samut Prakan' },
        { label: 'Goods', value: 'Refined sugar (10 cartons)' },
        { label: 'Slot', value: '15 Aug 2025 · 09:00' },
        { label: 'Notes', value: 'Check in with receiving office' },
      ],
    },
    {
      id: 'dropoff-2',
      title: 'Drop-off · Thai Sugar Factory',
      icon: 'check',
      tag: { label: 'POD Completed', tone: 'pod' },
      fields: [
        { label: 'Contact', value: 'Patarapol' },
        { label: 'Route', value: 'SAM001 Mueang / Samut Prakan' },
        { label: 'Goods', value: 'Refined sugar (10 cartons)' },
        { label: 'Slot', value: '15 Aug 2025 · 09:00' },
        { label: 'Notes', value: 'Escort to production dock' },
      ],
    },
    {
      id: 'dropoff-3',
      title: 'Drop-off · SweetCo Distribution',
      icon: 'location',
      tag: { label: 'POD Completed', tone: 'pod' },
      fields: [
        { label: 'Contact', value: 'Porntip Nilchan' },
        { label: 'Route', value: 'SAM002 Bang Sao Thong / Samut Prakan' },
        { label: 'Goods', value: 'Refined sugar (10 cartons)' },
        { label: 'Slot', value: '15 Aug 2025 · 09:30' },
        { label: 'Notes', value: 'Deliver to security gate' },
      ],
    },
  ],
}

const TRANSPORTATION_JOBS: TransportationJob[] = [
  {
    id: 'ORO0001',
    code: 'TRK-2024-011',
    date: '29 FEB 64',
    time: '10:00',
    employer: 'IdeaPlus Public Co., Ltd.',
    segment: 'international',
    service: 'International inbound (single trip)',
    description: 'Coordinate reefer pickup from Bangkok Port and finalize customs clearance before arriving at Laem Chabang.',
    budget: '฿ 5,000',
    status: 'inProgress',
    direction: 'inbound',
    route: {
      origin: 'Bangkok Port',
      destination: 'Laem Chabang Warehouse',
    },
    equipment: 'Cabin, reefer unit, dashcam monitoring',
    contact: {
      name: 'Sasithorn P.',
      role: 'Dispatch lead',
      phone: '+66 94 123 7788',
    },
    detail: TRANSPORTATION_DETAIL_SAMPLE,
  },
  {
    id: 'ORO0003',
    code: 'TRK-2024-014',
    date: '29 FEB 64',
    time: '10:00',
    employer: 'Thai PM Charter Co., Ltd.',
    segment: 'domestic',
    service: 'Domestic - multi stop',
    description: 'Multi-stop milk run for dry goods. Confirm store delivery order and capture proof of delivery in-app.',
    budget: '฿ 3,200',
    status: 'waiting',
    direction: 'outbound',
    route: {
      origin: 'Bangkok Port',
      destination: 'Laem Chabang Warehouse',
    },
    contact: {
      name: 'Thanawat R.',
      role: 'Operations supervisor',
      phone: '+66 63 501 9988',
    },
    detail: TRANSPORTATION_DETAIL_SAMPLE,
  },
  {
    id: 'ORO0005',
    code: 'TRK-2024-016',
    date: '1 MAR 64',
    time: '08:00',
    employer: 'Thai Logistics Co., Ltd.',
    segment: 'international',
    service: 'International outbound (single trip)',
    description: 'Outbound customs run. Driver must stage container at Bangna warehouse before late-night export cut-off.',
    budget: '฿ 4,500',
    status: 'waiting',
    direction: 'outbound',
    route: {
      origin: 'Bangna Warehouse',
      destination: 'Laem Chabang Port',
    },
    equipment: 'GPS tracker, seal lock, PPE kit',
    contact: {
      name: 'Siriporn N.',
      role: 'Customer coordinator',
      phone: '+66 83 144 5520',
    },
    detail: TRANSPORTATION_DETAIL_SAMPLE,
  },
  {
    id: 'ORO0007',
    code: 'TRK-2024-019',
    date: '1 MAR 64',
    time: '14:00',
    employer: 'SCG Logistics Co., Ltd.',
    segment: 'domestic',
    service: 'Domestic - single trip',
    description: 'High-priority pallet transfer from Rayong to Bangkok. Ensure sensor readings stay within tolerance.',
    budget: '฿ 2,800',
    status: 'waiting',
    direction: 'inbound',
    route: {
      origin: 'Rayong Factory',
      destination: 'Bangkok Warehouse',
    },
    equipment: 'GPS beacons, temperature and vibration sensors',
    contact: {
      name: 'Pakpum C.',
      role: 'Shift dispatcher',
      phone: '+66 98 777 1233',
    },
    detail: TRANSPORTATION_DETAIL_SAMPLE,
  },
  {
    id: 'ORO0009',
    code: 'TRK-2024-022',
    date: '2 MAR 64',
    time: '09:30',
    employer: 'CP All Co., Ltd.',
    segment: 'domestic',
    service: 'Domestic - multi stop',
    description: 'City distribution across Bangkok branches. Confirm each drop sequence and update live ETAs.',
    budget: '฿ 3,600',
    status: 'inProgress',
    direction: 'inbound',
    route: {
      origin: 'Distribution Center',
      destination: 'Bangkok Branches',
    },
    contact: {
      name: 'Chanika W.',
      role: 'Regional dispatcher',
      phone: '+66 82 402 6671',
    },
    detail: TRANSPORTATION_DETAIL_SAMPLE,
  },
]

function formatCurrencyTHB(value: number) {
  return `฿ ${CURRENCY_FORMATTER.format(Math.max(0, Math.round(value)))}`
}

function formatDateToInputValue(date: Date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

function parseDateInput(value: string, fallback: Date) {
  if (!value) {
    return new Date(fallback)
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return new Date(fallback)
  }

  return parsed
}

function formatCustomerTimestamp(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function hashStringToSeed(input: string) {
  let hash = 0
  for (let index = 0; index < input.length; index += 1) {
    hash = Math.imul(31, hash) + input.charCodeAt(index)
    hash |= 0
  }

  return hash >>> 0
}

function createRandom(seed: number) {
  let state = seed || 1

  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function formatFinancialPeriodLabel(period: FinancialPeriod, offset: number, baseDate: Date) {
  if (period === 'year') {
    return `Year ${baseDate.getFullYear() + offset}`
  }

  if (period === 'month') {
    const date = new Date(baseDate)
    date.setMonth(date.getMonth() + offset)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const date = new Date(baseDate)
  date.setDate(date.getDate() + offset)
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

function generateFinancialSeries(period: FinancialPeriod, offset: number, seed: number) {
  const { points } = FINANCIAL_PERIOD_CONFIG[period]
  const random = createRandom(seed)
  const baseAdjustment =
    (random() - 0.5) * (period === 'year' ? 9000 : period === 'month' ? 6500 : period === 'day' ? 3200 : 4500)
  const base =
    48000 +
    (period === 'year' ? offset * 4200 : period === 'month' ? offset * 2400 : offset * 1200) +
    baseAdjustment
  const amplitude = period === 'day' ? 9000 : period === 'month' ? 15000 : 22000
  const variation = period === 'day' ? 1800 : period === 'month' ? 3200 : 6000

  return Array.from({ length: points }, (_, index) => {
    const oscillation =
      Math.sin((index + offset) * (Math.PI / (points - 1 || 1))) * amplitude * (0.8 + random() * 0.4)
    const noise = (random() - 0.5) * variation
    return Math.max(12000, base + oscillation + noise)
  })
}

function buildReceivables(totalRevenue: number) {
  const companies = ['Global Freight Co.', 'LogiMax Solutions', 'Skyline Transport']
  const allocations = [0.38, 0.34, 0.28]
  const receivablePool = totalRevenue * 0.16

  return companies.map((name, index) => ({
    name,
    amount: (receivablePool * allocations[index]) / allocations.reduce((sum, value) => sum + value, 0),
  }))
}

type CustomerSegment = 'all' | 'priority' | 'enterprise' | 'marketplace' | 'new'
type CustomerStatus = 'healthy' | 'attention' | 'at-risk'
type CustomerSort = 'recent' | 'spend' | 'retention'

type CustomerRecord = {
  id: string
  name: string
  company: string
  segment: Exclude<CustomerSegment, 'all'>
  location: string
  shipmentsThisMonth: number
  shipmentsChange: number
  spend: number
  spendChange: number
  retention: number
  status: CustomerStatus
  lastShipment: string
  contact: string
  avatarColor: string
}

const CUSTOMER_SEGMENT_OPTIONS: Array<{ label: string; value: CustomerSegment }> = [
  { label: 'All', value: 'all' },
  { label: 'Priority', value: 'priority' },
  { label: 'Enterprise', value: 'enterprise' },
  { label: 'Marketplace', value: 'marketplace' },
  { label: 'New', value: 'new' },
]

const CUSTOMER_SORT_OPTIONS: Array<{ label: string; value: CustomerSort }> = [
  { label: 'Recent activity', value: 'recent' },
  { label: 'Lifetime spend', value: 'spend' },
  { label: 'Retention score', value: 'retention' },
]

const CUSTOMER_STATUS_LABEL: Record<CustomerStatus, string> = {
  healthy: 'Healthy',
  attention: 'Needs Attention',
  'at-risk': 'At Risk',
}

const CUSTOMER_DATA: CustomerRecord[] = [
  {
    id: 'CUS-2045',
    name: 'Chaiya Logistics',
    company: 'Chaiya Logistics',
    segment: 'priority',
    location: 'Bangkok, TH',
    shipmentsThisMonth: 128,
    shipmentsChange: 12,
    spend: 486000,
    spendChange: 8,
    retention: 92,
    status: 'healthy',
    lastShipment: '2024-01-25T13:15:00Z',
    contact: 'N. Prasert · +66 80 886 4455',
    avatarColor: '#0aa37a',
  },
  {
    id: 'CUS-2032',
    name: 'Northern Fresh Foods',
    company: 'Northern Fresh Foods',
    segment: 'enterprise',
    location: 'Chiang Mai, TH',
    shipmentsThisMonth: 94,
    shipmentsChange: -4,
    spend: 392400,
    spendChange: -3,
    retention: 88,
    status: 'attention',
    lastShipment: '2024-01-24T08:40:00Z',
    contact: 'K. Supatra · +66 83 201 9922',
    avatarColor: '#1f4f85',
  },
  {
    id: 'CUS-1998',
    name: 'Siam Retail Group',
    company: 'Siam Retail Group',
    segment: 'enterprise',
    location: 'Pathum Thani, TH',
    shipmentsThisMonth: 142,
    shipmentsChange: 5,
    spend: 512800,
    spendChange: 6,
    retention: 95,
    status: 'healthy',
    lastShipment: '2024-01-26T10:05:00Z',
    contact: 'J. Kulrat · +66 81 333 4411',
    avatarColor: '#f59e0b',
  },
  {
    id: 'CUS-2070',
    name: 'Eastern Auto Parts',
    company: 'Eastern Auto Parts',
    segment: 'priority',
    location: 'Chonburi, TH',
    shipmentsThisMonth: 76,
    shipmentsChange: -9,
    spend: 318700,
    spendChange: -6,
    retention: 81,
    status: 'attention',
    lastShipment: '2024-01-23T16:20:00Z',
    contact: 'P. Thanida · +66 86 774 1122',
    avatarColor: '#c026d3',
  },
  {
    id: 'CUS-2104',
    name: 'Riverfront Marketplace',
    company: 'Riverfront Marketplace',
    segment: 'marketplace',
    location: 'Khon Kaen, TH',
    shipmentsThisMonth: 58,
    shipmentsChange: 18,
    spend: 182900,
    spendChange: 14,
    retention: 84,
    status: 'healthy',
    lastShipment: '2024-01-25T19:05:00Z',
    contact: 'S. Wirat · +66 90 211 3344',
    avatarColor: '#2563eb',
  },
  {
    id: 'CUS-2122',
    name: 'MaxiMart On-Demand',
    company: 'MaxiMart On-Demand',
    segment: 'new',
    location: 'Nakhon Ratchasima, TH',
    shipmentsThisMonth: 24,
    shipmentsChange: 24,
    spend: 76450,
    spendChange: 24,
    retention: 67,
    status: 'at-risk',
    lastShipment: '2024-01-22T11:45:00Z',
    contact: 'M. Jirawat · +66 62 998 7765',
    avatarColor: '#db2777',
  },
]

const CUSTOMER_SEGMENT_COLORS: Record<Exclude<CustomerSegment, 'all'>, string> = {
  priority: '#0aa37a',
  enterprise: '#2563eb',
  marketplace: '#f59e0b',
  new: '#db2777',
}

type CustomerSegmentEntry = {
  segment: Exclude<CustomerSegment, 'all'>
  label: string
  count: number
  percent: number
  color: string
}

type ProductStatus = 'in-stock' | 'low-stock' | 'out-of-stock'
type ProductCategory = 'fresh' | 'dry' | 'equipment' | 'cold-chain'
type ProductSort = 'turnover' | 'value' | 'stock'

type ProductRecord = {
  id: string
  name: string
  sku: string
  category: ProductCategory
  supplier: string
  status: ProductStatus
  stockUnits: number
  stockChange: number
  value: number
  valueChange: number
  turnoverDays: number
  reorderPoint: number
  lastRestock: string
  badgeColor: string
}

const PRODUCT_CATEGORY_OPTIONS: Array<{ label: string; value: ProductCategory; color: string }> = [
  { label: 'Fresh Food', value: 'fresh', color: '#22c55e' },
  { label: 'Dry Goods', value: 'dry', color: '#2563eb' },
  { label: 'Equipment', value: 'equipment', color: '#f59e0b' },
  { label: 'Cold Chain', value: 'cold-chain', color: '#0ea5e9' },
]

const PRODUCT_STATUS_LABEL: Record<ProductStatus, string> = {
  'in-stock': 'In Stock',
  'low-stock': 'Low Stock',
  'out-of-stock': 'Out of Stock',
}

const PRODUCT_DATA: ProductRecord[] = [
  {
    id: 'PRD-3012',
    name: 'Fresh chicken portions',
    sku: 'FG-CH-120',
    category: 'fresh',
    supplier: 'Northern Fresh Foods',
    status: 'in-stock',
    stockUnits: 1840,
    stockChange: 8,
    value: 286400,
    valueChange: 6,
    turnoverDays: 5,
    reorderPoint: 1200,
    lastRestock: '2024-01-26T09:30:00Z',
    badgeColor: '#0aa37a',
  },
  {
    id: 'PRD-2981',
    name: 'Premium jasmine rice 5kg',
    sku: 'DR-RC-220',
    category: 'dry',
    supplier: 'Siam Staples',
    status: 'in-stock',
    stockUnits: 3250,
    stockChange: 3,
    value: 211250,
    valueChange: 2,
    turnoverDays: 12,
    reorderPoint: 1800,
    lastRestock: '2024-01-24T14:10:00Z',
    badgeColor: '#2563eb',
  },
  {
    id: 'PRD-3104',
    name: 'Commercial pallet wraps',
    sku: 'EQ-PL-055',
    category: 'equipment',
    supplier: 'LogiWrap Co.',
    status: 'low-stock',
    stockUnits: 420,
    stockChange: -6,
    value: 50400,
    valueChange: -4,
    turnoverDays: 19,
    reorderPoint: 400,
    lastRestock: '2024-01-22T11:40:00Z',
    badgeColor: '#f59e0b',
  },
  {
    id: 'PRD-2877',
    name: 'Frozen seafood mix',
    sku: 'CC-SF-310',
    category: 'cold-chain',
    supplier: 'BlueWave Imports',
    status: 'in-stock',
    stockUnits: 960,
    stockChange: 5,
    value: 153600,
    valueChange: 7,
    turnoverDays: 7,
    reorderPoint: 700,
    lastRestock: '2024-01-25T18:05:00Z',
    badgeColor: '#0ea5e9',
  },
  {
    id: 'PRD-2994',
    name: 'Fresh leafy vegetables mix',
    sku: 'FG-GR-082',
    category: 'fresh',
    supplier: 'Green Harvest Farm',
    status: 'low-stock',
    stockUnits: 620,
    stockChange: -9,
    value: 37200,
    valueChange: -6,
    turnoverDays: 4,
    reorderPoint: 600,
    lastRestock: '2024-01-26T05:55:00Z',
    badgeColor: '#16a34a',
  },
  {
    id: 'PRD-3050',
    name: 'Disposable food containers',
    sku: 'EQ-CT-410',
    category: 'equipment',
    supplier: 'PackRight Manufacturing',
    status: 'in-stock',
    stockUnits: 2480,
    stockChange: 11,
    value: 74400,
    valueChange: 9,
    turnoverDays: 16,
    reorderPoint: 1500,
    lastRestock: '2024-01-21T16:20:00Z',
    badgeColor: '#f97316',
  },
]

type ProductCategoryEntry = {
  category: ProductCategory
  label: string
  color: string
  count: number
  percent: number
}

type SearchCategory = 'modules' | 'shipments' | 'customers' | 'workflows'

function FinancialScreen({ onBack }: { onBack: () => void }) {
  const [period, setPeriod] = useState<FinancialPeriod>('month')
  const [periodOffset, setPeriodOffset] = useState(0)
  const [baseDateInput, setBaseDateInput] = useState(DEFAULT_FINANCIAL_DATE_INPUT)

  const baseDate = useMemo(
    () => parseDateInput(baseDateInput, DEFAULT_FINANCIAL_BASE_DATE),
    [baseDateInput]
  )
  const chartSeed = useMemo(
    () => hashStringToSeed(`${baseDateInput}-${period}-${periodOffset}`),
    [baseDateInput, period, periodOffset]
  )
  const chartData = useMemo(() => generateFinancialSeries(period, periodOffset, chartSeed), [period, periodOffset, chartSeed])
  const periodLabel = useMemo(() => formatFinancialPeriodLabel(period, periodOffset, baseDate), [period, periodOffset, baseDate])
  const totalRevenue = useMemo(() => chartData.reduce((sum, value) => sum + value, 0), [chartData])
  const averageRevenue = chartData.length ? totalRevenue / chartData.length : 0
  const profitEstimate = averageRevenue * 0.72
  const expenseEstimate = averageRevenue - profitEstimate
  const receivables = useMemo(() => buildReceivables(totalRevenue), [totalRevenue])
  const receivablesTotal = useMemo(() => receivables.reduce((sum, item) => sum + item.amount, 0), [receivables])

  const growthRate = useMemo(() => {
    if (chartData.length < 2) {
      return 0
    }

    const first = chartData[0]
    const last = chartData[chartData.length - 1]

    if (first === 0) {
      return 0
    }

    return ((last - first) / first) * 100
  }, [chartData])

  const handlePeriodChange = (next: FinancialPeriod) => {
    setPeriod(next)
    setPeriodOffset(0)
  }

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setBaseDateInput(value || DEFAULT_FINANCIAL_DATE_INPUT)
    setPeriodOffset(0)
  }

  const handlePrevPeriod = () => {
    setPeriodOffset((current) => current - 1)
  }

  const handleNextPeriod = () => {
    setPeriodOffset((current) => current + 1)
  }

  const growthClassName = growthRate >= 0 ? 'financial-growth' : 'financial-decline'
  const growthSymbol = growthRate >= 0 ? '▲' : '▼'

  return (
    <div className="financial-screen" role="presentation">
      <div className="status-bar status-bar--inverse financial-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>

      <header className="financial-header">
        <button type="button" className="info-back" onClick={onBack} aria-label="Back to home">
          <span />
        </button>
        <h2>Financial</h2>
        <button type="button" className="financial-filter" aria-label="Filter">
          <span>☰</span>
        </button>
      </header>

      <nav className="financial-tabs" aria-label="Financial period">
        {Object.entries(FINANCIAL_PERIOD_CONFIG).map(([key, { label }]) => (
          <button
            key={key}
            type="button"
            className={key === period ? 'active' : undefined}
            onClick={() => handlePeriodChange(key as FinancialPeriod)}
          >
            {label}
          </button>
        ))}
      </nav>

      <main className="financial-content">
        <div className="financial-controls">
        <div className="financial-period">
          <button type="button" aria-label="Previous period" onClick={handlePrevPeriod}>
            ‹
          </button>
          <span>{periodLabel}</span>
          <button type="button" aria-label="Next period" onClick={handleNextPeriod}>
            ›
          </button>
          </div>
          <div className="financial-date-picker">
            <label htmlFor="financial-date" className="sr-only">
              Select base date
            </label>
            <input id="financial-date" type="date" value={baseDateInput} onChange={handleDateChange} />
          </div>
        </div>

        <section className="financial-summary">
          <article className="financial-summary-card financial-summary-card--profit">
            <span role="img" aria-hidden="true">
              📈
            </span>
            <div>
              <h3>Profit</h3>
              <p>{formatCurrencyTHB(profitEstimate)}</p>
            </div>
          </article>
          <article className="financial-summary-card financial-summary-card--expense">
            <span role="img" aria-hidden="true">
              💸
            </span>
            <div>
              <h3>Expenses</h3>
              <p>{formatCurrencyTHB(expenseEstimate)}</p>
            </div>
          </article>
        </section>

        <section className="financial-chart">
          <header>
            <div>
              <h3>Total Revenue</h3>
              <span>{formatCurrencyTHB(averageRevenue)}</span>
            </div>
            <div className="financial-chart-meta">
              <span className={growthClassName}>
                {growthSymbol} {Math.abs(growthRate).toFixed(1)}%
              </span>
              <span>vs previous</span>
            </div>
          </header>
          <FinancialChart data={chartData} />
        </section>

        <section className="financial-list">
          <header>
            <h3>Outstanding Receivables</h3>
            <span>{receivables.length} companies</span>
          </header>
          <div className="financial-total">
            <span>Total Balance</span>
            <strong>{formatCurrencyTHB(receivablesTotal)}</strong>
          </div>
          <ul>
            {receivables.map((company) => (
              <li key={company.name}>
                <span>{company.name}</span>
                <span>{formatCurrencyTHB(company.amount)}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <div className="home-indicator home-indicator--raised" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

function ShippingScreen({ onBack }: { onBack: () => void }) {
  type ShippingTimeframe = 'day' | 'month' | 'year'
  const [timeframe, setTimeframe] = useState<ShippingTimeframe>('year')
  const [yearOffset, setYearOffset] = useState(0)
  const [shippingTypeFilter, setShippingTypeFilter] = useState('all')

  // Convert AD year to Buddhist Era (BE) year (AD + 543)
  const getCurrentYearBE = () => {
    const date = new Date()
    const adYear = date.getFullYear() + yearOffset
    return adYear + 543 // Convert to Buddhist Era
  }

  const currentYearBE = getCurrentYearBE()
  const currentYearAD = currentYearBE - 543
  const yearLabel = `B.E. ${currentYearBE}`

  const shippingTypeOptions = [
    { value: 'all', label: 'All Shipping Types' },
    { value: 'domestic-single', label: 'Domestic (Single Trip)' },
    { value: 'domestic-multiple', label: 'Domestic (Multiple Stops)' },
    { value: 'international', label: 'International Route' },
  ]

  const jobInfoCards = [
    {
      id: 'total',
      title: 'Total Jobs',
      value: '300',
      change: '2%',
      icon: SHIPPING_ALL_JOBS_ICON,
    },
    {
      id: 'successful',
      title: 'Completed',
      value: '299',
      change: '2%',
      icon: SHIPPING_SUCCESS_ICON,
    },
    {
      id: 'in-progress',
      title: 'In Delivery',
      value: '1',
      change: '2%',
      icon: SHIPPING_TRUCK_ICON_1,
    },
    {
      id: 'canceled',
      title: 'Cancelled',
      value: '2',
      change: '2%',
      icon: SHIPPING_CANCEL_ICON,
    },
  ]

  const shippingTypeCards = [
    {
      id: 'domestic-single',
      title: 'Domestic (Single Trip)',
      value: '100,000',
      change: '2%',
    },
    {
      id: 'domestic-multiple',
      title: 'Domestic (Multiple Stops)',
      value: '100,000',
      change: '2%',
    },
    {
      id: 'international',
      title: 'International Route',
      value: '100,000',
      change: '2%',
    },
  ]

  const regionCards = [
    { id: 'north', title: 'North', value: '300', change: '2%' },
    { id: 'central', title: 'Central', value: '300', change: '2%' },
    { id: 'northeast', title: 'Northeast', value: '300', change: '2%' },
    { id: 'east', title: 'East', value: '300', change: '2%' },
    { id: 'west', title: 'West', value: '300', change: '2%' },
    { id: 'south', title: 'South', value: '300', change: '2%' },
  ]

  const timeframeOptions: Array<{ key: ShippingTimeframe; label: string }> = [
    { key: 'day', label: 'Day' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
  ]

  return (
    <div className="shipping-screen">
      <header className="shipping-header">
        <button type="button" className="shipping-header__back" onClick={onBack} aria-label="Back">
          <img src={SHIPPING_ARROW_LEFT_ICON} alt="" />
        </button>
        <div className="shipping-header__title">
          <h1>Shipping</h1>
        </div>
      </header>

      <main className="shipping-content">
        <nav className="shipping-tabs" role="tablist" aria-label="Shipping timeframes">
          {timeframeOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              role="tab"
              aria-selected={timeframe === option.key}
              className={`shipping-tab${timeframe === option.key ? ' shipping-tab--active' : ''}`}
              onClick={() => setTimeframe(option.key)}
            >
              {option.label}
            </button>
          ))}
        </nav>

        <section className="shipping-year-selector">
          <button
            type="button"
            className="shipping-year-selector__control"
            aria-label="Previous year"
            onClick={() => setYearOffset((value) => value - 1)}
          >
            <img src={SHIPPING_NAV_BEFORE_ICON} alt="" />
          </button>
          <div className="shipping-year-selector__label">
            <strong>{yearLabel}</strong>
          </div>
          <button
            type="button"
            className="shipping-year-selector__control shipping-year-selector__control--next"
            aria-label="Next year"
            onClick={() => setYearOffset((value) => value + 1)}
          >
            <img src={SHIPPING_NAV_NEXT_ICON} alt="" />
          </button>
        </section>

        <div className="shipping-filter">
          <select
            className="shipping-filter__select"
            value={shippingTypeFilter}
            onChange={(e) => setShippingTypeFilter(e.target.value)}
            aria-label="Shipping type filter"
          >
            {shippingTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <img src={SHIPPING_ARROW_DOWN_ICON} alt="" className="shipping-filter__arrow" />
        </div>

        <section className="shipping-section">
          <div className="shipping-section__header">
            <h2>Shipping Job Information</h2>
            <span className="shipping-section__compare">Compare year: {currentYearAD - 1}</span>
          </div>
          <div className="shipping-job-info">
            {jobInfoCards.map((card) => (
              <article key={card.id} className="shipping-job-card">
                <div className="shipping-job-card__icon">
                  <img src={card.icon} alt="" />
                </div>
                <div className="shipping-job-card__content">
                  <p>{card.title}</p>
                  <div className="shipping-job-card__values">
                    <strong>{card.value}</strong>
                    <span className="shipping-job-card__change">
                      <img src={SHIPPING_ARROW_UP_ICON} alt="" className="shipping-job-card__change-icon" />
                      {card.change}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="shipping-section">
          <div className="shipping-section__header">
            <h2>Shipping by Type</h2>
            <span className="shipping-section__compare">Compare year: {currentYearAD - 1}</span>
          </div>
          <div className="shipping-type-cards">
            {shippingTypeCards.map((card) => (
              <article key={card.id} className="shipping-type-card">
                <p>{card.title}</p>
                <div className="shipping-type-card__values">
                  <strong>{card.value}</strong>
                  <span className="shipping-type-card__change">
                    <img src={SHIPPING_ARROW_UP_ICON} alt="" className="shipping-type-card__change-icon" />
                    {card.change}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="shipping-section">
          <div className="shipping-section__header">
            <h2>Shipping by Region</h2>
            <span className="shipping-section__compare">Compare year: {currentYearAD - 1}</span>
          </div>
          <div className="shipping-region-cards">
            {regionCards.map((card) => (
              <article key={card.id} className="shipping-region-card">
                <p>{card.title}</p>
                <div className="shipping-region-card__values">
                  <strong>{card.value}</strong>
                  <span className="shipping-region-card__change">
                    <img src={SHIPPING_ARROW_UP_ICON} alt="" className="shipping-region-card__change-icon" />
                    {card.change}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

function TransportationScreen({ onBack, onSelectTab }: { onBack: () => void; onSelectTab: (tab: BottomNavTab) => void }) {
  const [segment, setSegment] = useState<TransportationSegment>('international')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedJob, setSelectedJob] = useState<TransportationJob | null>(null)

  const visibleJobs = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase()
    return TRANSPORTATION_JOBS.filter((job) => {
      if (job.segment !== segment) {
        return false
      }
      if (!normalized) {
        return true
      }
      return [job.id, job.code, job.employer, job.route.origin, job.route.destination, job.service]
        .join(' ')
        .toLowerCase()
        .includes(normalized)
    })
  }, [segment, searchTerm])

  const handleOpenJob = (job: TransportationJob) => {
    setSelectedJob(job)
  }

  const handleCloseJob = () => {
    setSelectedJob(null)
  }

  return (
    <div className="transportation-screen">
      <div className="status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>

      <header className="transportation-header">
        <div className="transportation-header__user">
          <img src={TRANSPORTATION_USER_IMAGE} alt="" className="transportation-header__avatar" />
          <div>
            <p className="transportation-header__greeting">Good afternoon</p>
            <h1 className="transportation-header__title">Shipping Workspace</h1>
          </div>
        </div>
        <button type="button" className="transportation-header__notification" aria-label="Notifications">
          <img src={TRANSPORTATION_NOTIFICATION_ICON} alt="" aria-hidden="true" />
        </button>
        <button type="button" className="transportation-header__logout" onClick={onBack} aria-label="Logout">
          <img src={TRANSPORTATION_POWER_ICON} alt="" aria-hidden="true" />
        </button>
      </header>

      <nav className="transportation-tabs">
        {TRANSPORTATION_SEGMENTS.map((entry) => (
          <button
            key={entry.value}
            type="button"
            className={segment === entry.value ? 'active' : ''}
            onClick={() => setSegment(entry.value)}
          >
            <span>{entry.label}</span>
            <small>{entry.helper}</small>
          </button>
        ))}
      </nav>

      <div className="transportation-search">
        <span className="transportation-search__icon">
          <img src={TRANSPORTATION_SEARCH_ICON} alt="" />
        </span>
        <input
          type="search"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <main className="transportation-content">
        <header className="transportation-content__header">
          <div>
            <p>Job list <strong>{visibleJobs.length} items</strong></p>
          </div>
        </header>

        <div className="transportation-cards">
          {visibleJobs.map((job) => (
            <article
              key={job.id}
              className="transportation-card"
              role="button"
              tabIndex={0}
              onClick={() => handleOpenJob(job)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  handleOpenJob(job)
                }
              }}
            >
              <header className="transportation-card__header">
                <div className="transportation-card__id">
                  Order ID {job.id}
                  <span className={`transportation-card__direction transportation-card__direction--${job.direction}`}>
                    {job.direction === 'inbound' ? 'Inbound' : 'Outbound'}
                  </span>
                </div>
                <div className="transportation-card__meta">
                  <img src={TRANSPORTATION_CLOCK_ICON} alt="" />
                  <span>{job.date}</span>
                  <span>|</span>
                  <span>{job.time}</span>
                </div>
              </header>

              <div className="transportation-card__customer">
                <label>Customer:</label>
                <span>{job.employer}</span>
              </div>
              <p className="transportation-card__service">{job.service}</p>

              <div className="transportation-card__route">
                <div className="transportation-route-group">
                  <div className="transportation-route-item">
                    <div className="transportation-route-marker">
                      <img src={TRANSPORTATION_START_ICON} alt="" />
                    </div>
                    <div className="transportation-route-connector" />
                  </div>
                  <div>
                    <label>Origin</label>
                    <strong>{job.route.origin}</strong>
                  </div>
                </div>
                <div className="transportation-route-group">
                  <div className="transportation-route-item">
                    <div className="transportation-route-marker transportation-route-marker--destination">
                      <img src={TRANSPORTATION_LOCATION_ICON} alt="" />
                    </div>
                  </div>
                  <div>
                    <label>Destination</label>
                    <strong>{job.route.destination}</strong>
                  </div>
                </div>
                {job.status === 'inProgress' && (
                  <span className="transportation-card__status">In Progress</span>
                )}
              </div>

              {job.equipment && (
                <div className="transportation-card__equipment">
                  <div>
                    <label>Vehicle equipment:</label>
                    <span>{job.equipment}</span>
                  </div>
                  <div>
                    <label>Safety equipment:</label>
                    <span>-</span>
                  </div>
                </div>
              )}

              <div className="transportation-card__actions">
                <button
                  type="button"
                  className="transportation-btn transportation-btn--outline"
                  onClick={(event) => {
                    event.stopPropagation()
                    handleOpenJob(job)
                  }}
                >
                  View job
                </button>
                <button type="button" className="transportation-btn transportation-btn--outline">
                  <img src={TRANSPORTATION_CHAT_ICON} alt="" />
                  Chat with transportation
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>

      <nav className="transportation-bottom-nav">
        <button type="button" className="transportation-bottom-nav__item" onClick={() => onSelectTab('home')}>
          <span className="transportation-bottom-nav__icon">
            <img src={TRANSPORTATION_NAV_HOME_ICON} alt="" aria-hidden="true" />
          </span>
          <span>Dashboard</span>
        </button>
        <button
          type="button"
          className="transportation-bottom-nav__item transportation-bottom-nav__item--active"
        >
          <span className="transportation-bottom-nav__icon">
            <img src={TRANSPORTATION_NAV_TRANSPORT_ICON} alt="" aria-hidden="true" />
          </span>
          <span>Transportation</span>
        </button>
        <button type="button" className="transportation-bottom-nav__item" onClick={() => onSelectTab('chat')}>
          <span className="transportation-bottom-nav__icon">
            <img src={TRANSPORTATION_NAV_CHAT_ICON} alt="" aria-hidden="true" />
          </span>
          <span>Chat</span>
        </button>
        <button type="button" className="transportation-bottom-nav__item" onClick={() => onSelectTab('settings')}>
          <span className="transportation-bottom-nav__icon">
            <img src={TRANSPORTATION_NAV_SETTINGS_ICON} alt="" aria-hidden="true" />
          </span>
          <span>Settings</span>
        </button>
      </nav>

      <div className="home-indicator">
        <span />
      </div>

      {selectedJob ? <TransportationJobDetail job={selectedJob} onClose={handleCloseJob} /> : null}
    </div>
  )
}

function TransportationJobDetail({ job, onClose }: { job: TransportationJob; onClose: () => void }) {
  const detail = job.detail ?? TRANSPORTATION_DETAIL_SAMPLE

  return (
    <div
      className="transportation-detail-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Job ${job.id} details`}
      onClick={onClose}
    >
      <div
        className="transportation-detail"
        onClick={(event) => {
          event.stopPropagation()
        }}
      >
        <div className="transportation-detail-status-bar" aria-hidden="true">
          <span className="status-time">9:41</span>
        </div>

        <header className="transportation-detail__header">
          <button type="button" className="transportation-detail-back" onClick={onClose} aria-label="Back to jobs">
            <span />
          </button>
          <div className="transportation-detail__code">
            <p>{job.id}</p>
          </div>
          <span className="transportation-detail-header__spacer" />
        </header>

        <section className="transportation-detail-client">
          <div className="transportation-detail-field">
            <span className="transportation-detail-field__label">Client</span>
            <span className="transportation-detail-field__colon">:</span>
            <span className="transportation-detail-field__value">{detail.client}</span>
          </div>
        </section>

        <section className="transportation-detail-timeline">
          {detail.stops.map((stop, index) => (
            <div key={stop.id} className="transportation-detail-step">
              <div className="transportation-detail-step__timeline">
                <span className={`transportation-detail-step__icon transportation-detail-step__icon--${stop.icon}`}>
                  {stop.icon === 'location' ? <img src={TRANSPORTATION_LOCATION_ICON} alt="" aria-hidden="true" /> : null}
                </span>
                {index < detail.stops.length - 1 && <span className="transportation-detail-step__line" />}
              </div>
              <article className="transportation-detail-stop-card">
                <header className="transportation-detail-stop-card__header">
                  <p>{stop.title}</p>
                  <span className={`transportation-detail-tag transportation-detail-tag--${stop.tag.tone}`}>
                    {stop.tag.label}
                  </span>
                </header>
                <div className="transportation-detail-stop-card__fields">
                  {stop.fields.map((field) => (
                    <div key={`${stop.id}-${field.label}`} className="transportation-detail-field transportation-detail-field--stacked">
                      <span className="transportation-detail-field__label">{field.label}</span>
                      <span className="transportation-detail-field__colon">:</span>
                      <span className="transportation-detail-field__value">{field.value}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          ))}
        </section>

        <div className="home-indicator home-indicator--raised" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  )
}

function CustomersScreen({ onBack }: { onBack: () => void }) {
  const [segment, setSegment] = useState<CustomerSegment>('all')
  const [sortBy, setSortBy] = useState<CustomerSort>('recent')
  const [searchTerm, setSearchTerm] = useState('')

  const summary = useMemo(() => {
    const active = CUSTOMER_DATA.length
    const retention =
      CUSTOMER_DATA.reduce((sum, customer) => sum + customer.retention, 0) / (CUSTOMER_DATA.length || 1)
    const atRisk = CUSTOMER_DATA.filter((customer) => customer.status === 'at-risk').length
    const monthlySpend = CUSTOMER_DATA.reduce((sum, customer) => sum + customer.spend, 0)

    return {
      active,
      retention: Math.round(retention),
      atRisk,
      monthlySpend,
    }
  }, [])

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const base = CUSTOMER_DATA.filter((customer) => {
      if (segment !== 'all' && customer.segment !== segment) {
        return false
      }

      if (!normalizedSearch) {
        return true
      }

      const haystack = `${customer.name} ${customer.company} ${customer.location} ${customer.contact}`.toLowerCase()
      return haystack.includes(normalizedSearch)
    })

    const sorted = [...base].sort((a, b) => {
      if (sortBy === 'spend') {
        return b.spend - a.spend
      }

      if (sortBy === 'retention') {
        return b.retention - a.retention
      }

      return new Date(b.lastShipment).getTime() - new Date(a.lastShipment).getTime()
    })

    return sorted
  }, [segment, sortBy, searchTerm])

  const segmentBreakdown = useMemo<CustomerSegmentEntry[]>(() => {
    const totals: Record<Exclude<CustomerSegment, 'all'>, number> = {
      priority: 0,
      enterprise: 0,
      marketplace: 0,
      new: 0,
    }

    CUSTOMER_DATA.forEach((customer) => {
      totals[customer.segment] += 1
    })

    const totalCount = Object.values(totals).reduce((sum, value) => sum + value, 0)

    return (Object.keys(totals) as Array<Exclude<CustomerSegment, 'all'>>)
      .map((key) => {
        const count = totals[key]
        const option = CUSTOMER_SEGMENT_OPTIONS.find((entry) => entry.value === key)
        return {
          segment: key,
          label: option?.label ?? key,
          count,
          percent: totalCount ? (count / totalCount) * 100 : 0,
          color: CUSTOMER_SEGMENT_COLORS[key],
        }
      })
      .sort((a, b) => b.count - a.count)
  }, [])

  return (
    <div className="customers-screen" role="presentation">
      <div className="status-bar status-bar--inverse customers-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>

      <header className="customers-header">
        <button type="button" className="info-back" onClick={onBack} aria-label="Back to home">
          <span />
        </button>
        <div className="customers-header-text">
          <h2>Customers</h2>
          <span>Account health and recent performance</span>
        </div>
        <button type="button" className="customers-header-action">
          + Add customer
        </button>
      </header>

      <main className="customers-content">
        <section className="customers-summary">
          <article className="customers-summary-card customers-summary-card--highlight">
            <span className="customers-summary-label">Active customers</span>
            <strong>{summary.active}</strong>
            <span className="customers-summary-meta">Across all segments</span>
          </article>
          <article className="customers-summary-card">
            <span className="customers-summary-label">Average retention</span>
            <strong>{summary.retention}%</strong>
            <span className="customers-summary-meta">Rolling 12 weeks</span>
          </article>
          <article className="customers-summary-card customers-summary-card--alert">
            <span className="customers-summary-label">At risk</span>
            <strong>{summary.atRisk}</strong>
            <span className="customers-summary-meta">Need outreach today</span>
          </article>
          <article className="customers-summary-card">
            <span className="customers-summary-label">Monthly spend</span>
            <strong>{formatCurrencyTHB(summary.monthlySpend)}</strong>
            <span className="customers-summary-meta">Combined gross volume</span>
          </article>
        </section>

        <section className="customers-chart">
          <CustomerSegmentChart segments={segmentBreakdown} />
        </section>

        <section className="customers-controls">
          <div className="customers-search">
            <span aria-hidden="true">🔍</span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by customer, location, or contact"
              aria-label="Search customers"
            />
          </div>
          <div className="customers-controls-actions">
            <div className="customers-segments" role="tablist" aria-label="Customer segments">
              {CUSTOMER_SEGMENT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="tab"
                  className={segment === option.value ? 'active' : undefined}
                  aria-selected={segment === option.value}
                  onClick={() => setSegment(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="customers-sort">
              <label htmlFor="customers-sort">Sort by</label>
              <select
                id="customers-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as CustomerSort)}
              >
                {CUSTOMER_SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <button type="button" className="customers-export">
              Export CSV
            </button>
          </div>
        </section>

        <section className="customers-list" aria-label="Customer accounts">
          <header>
            <h3>Customer Accounts</h3>
            <span>{filteredCustomers.length} results</span>
          </header>
          <ul>
            {filteredCustomers.map((customer) => {
              const segmentLabel =
                CUSTOMER_SEGMENT_OPTIONS.find((option) => option.value === customer.segment)?.label ?? customer.segment
              const shipmentsPositive = customer.shipmentsChange >= 0
              const spendPositive = customer.spendChange >= 0

              return (
                <li key={customer.id} className="customers-row">
                  <div className="customers-row-main">
                    <span className="customers-avatar" style={{ background: customer.avatarColor }}>
                      {customer.name.slice(0, 1)}
                    </span>
                    <div className="customers-row-info">
                      <div className="customers-row-info-header">
                        <h4>{customer.name}</h4>
                        <CustomerStatusBadge status={customer.status} />
                      </div>
                      <div className="customers-row-info-sub">
                        <span>{customer.company}</span>
                        <span>• {segmentLabel}</span>
                        <span>• {customer.location}</span>
                      </div>
                    </div>
                    <button type="button" className="customers-row-action">
                      View profile
                    </button>
                  </div>

                  <div className="customers-row-metrics">
                    <div className="customers-metric">
                      <label>Shipments (30d)</label>
                      <strong>{customer.shipmentsThisMonth}</strong>
                      <span className={`customers-change ${shipmentsPositive ? 'positive' : 'negative'}`}>
                        {shipmentsPositive ? '▲' : '▼'} {Math.abs(customer.shipmentsChange)}%
                      </span>
                    </div>
                    <div className="customers-metric">
                      <label>Spend (30d)</label>
                      <strong>{formatCurrencyTHB(customer.spend)}</strong>
                      <span className={`customers-change ${spendPositive ? 'positive' : 'negative'}`}>
                        {spendPositive ? '▲' : '▼'} {Math.abs(customer.spendChange)}%
                      </span>
                    </div>
                    <div className="customers-retention">
                      <label>Retention score</label>
                      <div className="customers-retention-bar">
                        <span style={{ width: `${customer.retention}%` }} />
                      </div>
                      <span className="customers-retention-value">{customer.retention}%</span>
                    </div>
                  </div>

                  <div className="customers-row-footer">
                    <div>
                      <label>Last shipment</label>
                      <span>{formatCustomerTimestamp(customer.lastShipment)}</span>
                    </div>
                    <div>
                      <label>Account contact</label>
                      <span>{customer.contact}</span>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </main>

      <div className="home-indicator home-indicator--raised" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  return (
    <span className={`customers-status customers-status--${status}`}>
      <span className="customers-status-dot" aria-hidden="true" />
      {CUSTOMER_STATUS_LABEL[status]}
    </span>
  )
}

function CustomerSegmentChart({ segments }: { segments: CustomerSegmentEntry[] }) {
  const total = useMemo(
    () => segments.reduce((sum, segment) => sum + segment.count, 0),
    [segments]
  )

  const chartData = useMemo(() => {
    const radius = 48
    const circumference = 2 * Math.PI * radius
    let cumulative = 0

    return segments
      .filter((segment) => segment.count > 0)
      .map((segment) => {
        const length = (segment.percent / 100) * circumference
        const dashArray = `${length} ${circumference}`
        const dashOffset = circumference - cumulative - length
        cumulative += length

        return {
          ...segment,
          dashArray,
          dashOffset,
          radius,
          circumference,
        }
      })
  }, [segments])

  const centerLabel = total > 0 ? (
    <>
      <strong>{total}</strong>
      <span>accounts</span>
    </>
  ) : (
    <>
      <strong>0</strong>
      <span>No data</span>
    </>
  )

  return (
    <article className="customers-chart-card">
      <header>
        <div>
          <h3>Segment distribution</h3>
          <span>Share of active customers</span>
        </div>
        <button type="button" className="customers-chart-action">
          View segments
        </button>
      </header>

      <div className="customers-chart-body">
        <div className="customers-chart-visual">
          <svg className="customers-pie" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet">
            <circle className="customers-pie-base" cx="60" cy="60" r="48" />
            {chartData.map((segment) => (
              <circle
                key={segment.segment}
                className="customers-pie-slice"
                cx="60"
                cy="60"
                r="48"
                stroke={segment.color}
                strokeDasharray={segment.dashArray}
                strokeDashoffset={segment.dashOffset}
              />
            ))}
          </svg>
          <div className="customers-chart-center">{centerLabel}</div>
        </div>

        <ul className="customers-chart-legend">
          {segments.map((segment) => (
            <li key={segment.segment}>
              <span className="customers-legend-dot" style={{ background: segment.color }} />
              <div>
                <strong>{segment.label}</strong>
                <span>
                  {segment.count} · {segment.percent.toFixed(1)}%
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

function ProductsScreen({ onBack }: { onBack: () => void }) {
  const [sortBy, setSortBy] = useState<ProductSort>('turnover')
  const [searchTerm, setSearchTerm] = useState('')

  const summary = useMemo(() => {
    const totalSkus = PRODUCT_DATA.length
    const lowStock = PRODUCT_DATA.filter((product) => product.status !== 'in-stock').length
    const inventoryValue = PRODUCT_DATA.reduce((sum, product) => sum + product.value, 0)
    const averageTurnover =
      PRODUCT_DATA.reduce((sum, product) => sum + product.turnoverDays, 0) / (PRODUCT_DATA.length || 1)

    return {
      totalSkus,
      lowStock,
      inventoryValue,
      averageTurnover: Math.round(averageTurnover),
    }
  }, [])

  const categoryBreakdown = useMemo<ProductCategoryEntry[]>(() => {
    const counts: Record<ProductCategory, number> = {
      fresh: 0,
      dry: 0,
      equipment: 0,
      'cold-chain': 0,
    }

    PRODUCT_DATA.forEach((product) => {
      counts[product.category] += 1
    })

    const total = PRODUCT_DATA.length || 1

    return PRODUCT_CATEGORY_OPTIONS.map((option) => ({
      category: option.value,
      label: option.label,
      color: option.color,
      count: counts[option.value],
      percent: (counts[option.value] / total) * 100,
    }))
  }, [])

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const base = PRODUCT_DATA.filter((product) => {
      if (!normalizedSearch) {
        return true
      }

      const haystack = `${product.name} ${product.sku} ${product.supplier}`.toLowerCase()
      return haystack.includes(normalizedSearch)
    })

    return [...base].sort((a, b) => {
      if (sortBy === 'value') {
        return b.value - a.value
      }

      if (sortBy === 'stock') {
        return b.stockUnits - a.stockUnits
      }

      return a.turnoverDays - b.turnoverDays
    })
  }, [searchTerm, sortBy])

  return (
    <div className="products-screen" role="presentation">
      <div className="status-bar status-bar--inverse products-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>

      <header className="products-header">
        <button type="button" className="info-back" onClick={onBack} aria-label="Back to home">
          <span />
        </button>
        <div className="products-header-text">
          <h2>Products</h2>
          <span>Inventory mix and restock readiness</span>
        </div>
        <button type="button" className="products-header-action">
          Manage catalog
        </button>
      </header>

      <main className="products-content">
        <section className="products-summary">
          <article className="products-summary-card products-summary-card--highlight">
            <span className="products-summary-label">Active SKUs</span>
            <strong>{summary.totalSkus}</strong>
            <span className="products-summary-meta">Currently available</span>
          </article>
          <article className="products-summary-card">
            <span className="products-summary-label">Low stock alerts</span>
            <strong>{summary.lowStock}</strong>
            <span className="products-summary-meta">Require restock review</span>
          </article>
          <article className="products-summary-card">
            <span className="products-summary-label">Inventory value</span>
            <strong>{formatCurrencyTHB(summary.inventoryValue)}</strong>
            <span className="products-summary-meta">At landed cost</span>
          </article>
          <article className="products-summary-card">
            <span className="products-summary-label">Avg. turnover</span>
            <strong>{summary.averageTurnover} days</strong>
            <span className="products-summary-meta">Across all categories</span>
          </article>
        </section>

        <section className="products-chart">
          <ProductCategoryChart categories={categoryBreakdown} />
        </section>

        <section className="products-controls">
          <div className="products-search">
            <span aria-hidden="true">🔍</span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by product or supplier"
              aria-label="Search products"
            />
          </div>
          <div className="products-actions">
            <div className="products-sort">
              <label htmlFor="products-sort">Sort by</label>
              <select
                id="products-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as ProductSort)}
              >
                <option value="turnover">Fastest turnover</option>
                <option value="value">Inventory value</option>
                <option value="stock">Stock level</option>
              </select>
            </div>
            <button type="button" className="products-export">
              Export report
            </button>
          </div>
        </section>

        <section className="products-list" aria-label="Product catalog">
          <header>
            <h3>Inventory overview</h3>
            <span>{filteredProducts.length} products</span>
          </header>
          <ul>
            {filteredProducts.map((product) => {
              const category = PRODUCT_CATEGORY_OPTIONS.find((entry) => entry.value === product.category)
              const stockPositive = product.stockChange >= 0
              const valuePositive = product.valueChange >= 0

              return (
                <li key={product.id} className="products-row">
                  <div className="products-row-main">
                    <span className="products-avatar" style={{ background: product.badgeColor }}>
                      {product.name.slice(0, 1)}
                    </span>
                    <div className="products-row-info">
                      <div className="products-row-info-header">
                        <h4>{product.name}</h4>
                        <ProductStatusBadge status={product.status} />
                      </div>
                      <div className="products-row-info-sub">
                        <span>{product.sku}</span>
                        <span>• {category?.label ?? product.category}</span>
                        <span>• {product.supplier}</span>
                      </div>
                    </div>
                    <button type="button" className="products-row-action">
                      View stock card
                    </button>
                  </div>

                  <div className="products-row-metrics">
                    <div className="products-metric">
                      <label>Units on hand</label>
                      <strong>{product.stockUnits.toLocaleString()}</strong>
                      <span className={`products-change ${stockPositive ? 'positive' : 'negative'}`}>
                        {stockPositive ? '▲' : '▼'} {Math.abs(product.stockChange)}%
                      </span>
                    </div>
                    <div className="products-metric">
                      <label>Inventory value</label>
                      <strong>{formatCurrencyTHB(product.value)}</strong>
                      <span className={`products-change ${valuePositive ? 'positive' : 'negative'}`}>
                        {valuePositive ? '▲' : '▼'} {Math.abs(product.valueChange)}%
                      </span>
                    </div>
                    <div className="products-turnover">
                      <label>Turnover</label>
                      <div className="products-turnover-bar">
                        <span style={{ width: `${Math.min(100, (30 / product.turnoverDays) * 10)}%` }} />
                      </div>
                      <span className="products-turnover-value">{product.turnoverDays} days</span>
                    </div>
                  </div>

                  <div className="products-row-footer">
                    <div>
                      <label>Reorder point</label>
                      <span>{product.reorderPoint.toLocaleString()} units</span>
                    </div>
                    <div>
                      <label>Last restock</label>
                      <span>{formatCustomerTimestamp(product.lastRestock)}</span>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </main>

      <div className="home-indicator home-indicator--raised" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span className={`products-status products-status--${status}`}>
      <span className="products-status-dot" aria-hidden="true" />
      {PRODUCT_STATUS_LABEL[status]}
    </span>
  )
}

function ProductCategoryChart({ categories }: { categories: ProductCategoryEntry[] }) {
  const total = useMemo(
    () => categories.reduce((sum, entry) => sum + entry.count, 0),
    [categories]
  )

  const chartData = useMemo(() => {
    const radius = 48
    const circumference = 2 * Math.PI * radius
    let cumulative = 0

    return categories
      .filter((entry) => entry.count > 0)
      .map((entry) => {
        const length = (entry.percent / 100) * circumference
        const dashArray = `${length} ${circumference}`
        const dashOffset = circumference - cumulative - length
        cumulative += length

        return {
          ...entry,
          dashArray,
          dashOffset,
        }
      })
  }, [categories])

  return (
    <article className="products-chart-card">
      <header>
        <div>
          <h3>Category mix</h3>
          <span>Distribution across inventory</span>
        </div>
        <button type="button" className="products-chart-action">
          Adjust categories
        </button>
      </header>

      <div className="products-chart-body">
        <div className="products-chart-visual">
          <svg className="products-pie" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet">
            <circle className="products-pie-base" cx="60" cy="60" r="48" />
            {chartData.map((entry) => (
              <circle
                key={entry.category}
                className="products-pie-slice"
                cx="60"
                cy="60"
                r="48"
                stroke={entry.color}
                strokeDasharray={entry.dashArray}
                strokeDashoffset={entry.dashOffset}
              />
            ))}
          </svg>
          <div className="products-chart-center">
            <strong>{total}</strong>
            <span>categories</span>
          </div>
        </div>

        <ul className="products-chart-legend">
          {categories.map((entry) => (
            <li key={entry.category}>
              <span className="products-legend-dot" style={{ background: entry.color }} />
              <div>
                <strong>{entry.label}</strong>
                <span>
                  {entry.count} · {entry.percent.toFixed(1)}%
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

function FinancialChart({ data }: { data: number[] }) {
  const gradientId = useMemo(() => `financialGradient-${Math.random().toString(36).slice(2, 9)}`, [])
  const coordinates = useMemo(() => {
    if (data.length === 0) {
      return []
    }

    const max = Math.max(...data)
    const min = Math.min(...data)
    const span = max - min || 1
    const divisor = data.length > 1 ? data.length - 1 : 1

    return data.map((value, index) => {
      const x = (index / divisor) * 100
      const normalized = (value - min) / span
      const y = 88 - normalized * 68

      return { x, y }
    })
  }, [data])

  const areaPoints =
    coordinates.length > 1
      ? ['0,100', ...coordinates.map(({ x, y }) => `${x},${y}`), '100,100'].join(' ')
      : coordinates.length === 1
      ? `0,100 ${coordinates[0].x},${coordinates[0].y} 100,100`
      : ''

  const linePoints = coordinates.map(({ x, y }) => `${x},${y}`).join(' ')
  const gridLines = [22, 44, 66, 88]

  return (
    <div className="financial-chart-graph" aria-hidden="true">
      <svg className="financial-chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#00c188" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#126d8a" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {gridLines.map((y) => (
          <line key={y} className="financial-chart-grid" x1="0" x2="100" y1={y} y2={y} />
        ))}
        {areaPoints && <polygon className="financial-chart-area" points={areaPoints} fill={`url(#${gradientId})`} />}
        {linePoints && <polyline className="financial-chart-line-path" points={linePoints} />}
        {coordinates.map(({ x, y }, index) => (
          <circle key={index} className="financial-chart-point" cx={x} cy={y} r="1.6" />
        ))}
      </svg>
    </div>
  )
}

function VehicleInfoScreen({
  onBack,
  onContinue,
  data,
  onChange,
  trailerOptions,
  onTrailerOptionChange,
  vehicleDocs,
  onDocSelect,
}: VehicleInfoScreenProps) {
  const handleInputChange = (field: keyof VehicleFormData) => (event: ChangeEvent<HTMLInputElement>) => {
    onChange(field, event.target.value)
  }

  const handleSelectChange = (field: keyof VehicleFormData) => (event: ChangeEvent<HTMLInputElement>) => {
    onChange(field, event.target.value)
  }

  const handleDocSelect =
    (key: keyof typeof INITIAL_VEHICLE_DOCS) =>
    (file: File | null) => {
      onDocSelect(key, file)
    }

  return (
    <div className="vehicle-screen" role="presentation">
      <div className="status-bar status-bar--inverse truck-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>

      <header className="review-header">
        <button type="button" className="info-back" onClick={onBack} aria-label="Back to truck photos">
          <span />
        </button>
        <h2>Vehicle Information</h2>
      </header>

      <StepIndicator current={4} total={5} />

      <main className="vehicle-content">
        <section className="vehicle-section">
          <h3 className="vehicle-section-title">Registration Details</h3>
          <div className="vehicle-grid">
            <div className="info-field">
              <label htmlFor="registrationNumber">
                Registration Number <span className="required">*</span>
              </label>
              <input
                id="registrationNumber"
                placeholder="Enter registration number"
                value={data.registrationNumber}
                onChange={handleInputChange('registrationNumber')}
              />
            </div>
            <div className="info-field">
              <label htmlFor="registrationProvince">
                Registration Province <span className="required">*</span>
              </label>
              <div className="info-select">
                <input
                  id="registrationProvince"
                  placeholder="Select province"
                  value={data.registrationProvince}
                  onChange={handleSelectChange('registrationProvince')}
                />
              </div>
            </div>
            <div className="info-field">
              <label htmlFor="trailerRegistration">
                Trailer Registration <span className="required">*</span>
              </label>
              <input
                id="trailerRegistration"
                placeholder="Enter registration"
                value={data.trailerRegistration}
                onChange={handleInputChange('trailerRegistration')}
              />
            </div>
            <div className="info-field">
              <label htmlFor="trailerProvince">
                Trailer Province <span className="required">*</span>
              </label>
              <div className="info-select">
                <input
                  id="trailerProvince"
                  placeholder="Select province"
                  value={data.trailerProvince}
                  onChange={handleSelectChange('trailerProvince')}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="vehicle-section">
          <h3 className="vehicle-section-title">Vehicle Specs</h3>
          <div className="vehicle-grid">
            <div className="info-field">
              <label htmlFor="bodyType">
                Body Type <span className="required">*</span>
              </label>
              <div className="info-select">
                <input
                  id="bodyType"
                  placeholder="Select body type"
                  value={data.bodyType}
                  onChange={handleSelectChange('bodyType')}
                />
              </div>
            </div>
            <div className="info-field">
              <label htmlFor="brand">
                Brand <span className="required">*</span>
              </label>
              <div className="info-select">
                <input
                  id="brand"
                  placeholder="Select brand"
                  value={data.brand}
                  onChange={handleSelectChange('brand')}
                />
              </div>
            </div>
            <div className="info-field">
              <label htmlFor="model">
                Model <span className="required">*</span>
              </label>
              <div className="info-select">
                <input
                  id="model"
                  placeholder="Select model"
                  value={data.model}
                  onChange={handleSelectChange('model')}
                />
              </div>
            </div>
            <div className="info-field">
              <label htmlFor="vehicleColor">
                Vehicle Colour <span className="required">*</span>
              </label>
              <div className="info-select">
                <input
                  id="vehicleColor"
                  placeholder="Select vehicle colour"
                  value={data.vehicleColor}
                  onChange={handleSelectChange('vehicleColor')}
                />
              </div>
            </div>
            <div className="info-field">
              <label htmlFor="vin">
                VIN <span className="required">*</span>
              </label>
              <input id="vin" placeholder="Enter VIN" value={data.vin} onChange={handleInputChange('vin')} />
            </div>
            <div className="info-field">
              <label htmlFor="serviceYears">
                Years in Service <span className="required">*</span>
              </label>
              <input
                id="serviceYears"
                placeholder="Enter years"
                value={data.serviceYears}
                onChange={handleInputChange('serviceYears')}
              />
            </div>
            <div className="info-field">
              <label htmlFor="plateType">
                Plate Type <span className="required">*</span>
              </label>
              <div className="info-select">
                <input
                  id="plateType"
                  placeholder="Select plate type"
                  value={data.plateType}
                  onChange={handleSelectChange('plateType')}
                />
              </div>
            </div>
            <div className="info-field">
              <label htmlFor="payload">
                Payload Capacity (kg) <span className="required">*</span>
              </label>
              <input
                id="payload"
                placeholder="Enter payload"
                value={data.payload}
                onChange={handleInputChange('payload')}
              />
            </div>
          </div>

          <div className="vehicle-grid weights">
            <div className="info-field">
              <label htmlFor="weightFront">
                Front Axle (kg) <span className="required">*</span>
              </label>
              <input
                id="weightFront"
                placeholder="0"
                value={data.weightFront}
                onChange={handleInputChange('weightFront')}
              />
            </div>
            <div className="info-field">
              <label htmlFor="weightRear">
                Rear Axle (kg) <span className="required">*</span>
              </label>
              <input
                id="weightRear"
                placeholder="0"
                value={data.weightRear}
                onChange={handleInputChange('weightRear')}
              />
            </div>
            <div className="info-field">
              <label htmlFor="weightTotal">
                Gross Weight (kg) <span className="required">*</span>
              </label>
              <input
                id="weightTotal"
                placeholder="0"
                value={data.weightTotal}
                onChange={handleInputChange('weightTotal')}
              />
            </div>
          </div>
        </section>

        <section className="vehicle-section">
          <h3 className="vehicle-section-title">Trailer Compatibility</h3>
          <div className="vehicle-checkboxes">
            <label>
              <input
                type="checkbox"
                checked={trailerOptions.box20}
                onChange={(event) => onTrailerOptionChange('box20')(event.target.checked)}
              />
              20 ft Container
            </label>
            <label>
              <input
                type="checkbox"
                checked={trailerOptions.box40}
                onChange={(event) => onTrailerOptionChange('box40')(event.target.checked)}
              />
              40 ft Container
            </label>
          </div>
        </section>

        <section className="vehicle-section">
          <h3 className="vehicle-section-title">Supporting Documents</h3>
          <div className="vehicle-grid">
            <ImageDropzone
              id="vehicle-registration-doc"
              label="Vehicle Registration Certificate"
              helper={'Tap to capture or upload\nregistration certificate'}
              required
              value={vehicleDocs.registration}
              onChange={handleDocSelect('registration')}
            />
            <div className="info-field">
              <label htmlFor="insuranceValue">
                Insurance Coverage (THB) <span className="required">*</span>
              </label>
              <input
                id="insuranceValue"
                placeholder="Enter coverage value"
                value={data.insuranceValue}
                onChange={handleInputChange('insuranceValue')}
              />
            </div>
            <ImageDropzone
              id="vehicle-insurance-doc"
              label="Insurance Policy"
              helper={'Tap to capture or upload\ninsurance policy'}
              required
              value={vehicleDocs.insurance}
              onChange={handleDocSelect('insurance')}
            />
            <ImageDropzone
              id="vehicle-ownership-doc"
              label="Owner Identification"
              helper={'Tap to capture or upload\nowner ID'}
              required
              value={vehicleDocs.ownership}
              onChange={handleDocSelect('ownership')}
            />
            <ImageDropzone
              id="vehicle-tax-doc"
              label="Tax Receipt"
              helper={'Tap to capture or upload\ntax receipt'}
              required
              value={vehicleDocs.tax}
              onChange={handleDocSelect('tax')}
            />
          </div>
        </section>
      </main>

      <footer className="truck-footer">
        <button type="button" className="btn truck-continue" onClick={onContinue}>
          Continue
        </button>
      </footer>

      <div className="home-indicator home-indicator--raised" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

function ReviewScreen({
  onBack,
  onSubmit,
  infoData,
  avatarPreview,
  truckImages,
  hasTrailer,
  vehicleData,
  trailerOptions,
  vehicleDocs,
}: ReviewScreenProps) {
  const driverRows = [
    { label: 'Full Name', value: `${infoData.firstName} ${infoData.lastName}`.trim() || 'Not provided' },
    { label: 'Phone', value: infoData.phone || 'Not provided' },
    { label: 'Email', value: infoData.email || 'Not provided' },
    { label: 'Operating Region', value: infoData.region || 'Not provided' },
    {
      label: 'Daily Rate (฿)',
      value:
        infoData.rateMin || infoData.rateMax
          ? `${infoData.rateMin || '0'} – ${infoData.rateMax || '0'}`
          : 'Not provided',
    },
  ]

  const vehicleRows = [
    { label: 'Registration Number', value: vehicleData.registrationNumber || 'Not provided' },
    { label: 'Registration Province', value: vehicleData.registrationProvince || 'Not provided' },
    { label: 'Trailer Registration', value: vehicleData.trailerRegistration || 'Not provided' },
    { label: 'Trailer Province', value: vehicleData.trailerProvince || 'Not provided' },
    { label: 'Body Type', value: vehicleData.bodyType || 'Not provided' },
    { label: 'Brand', value: vehicleData.brand || 'Not provided' },
    { label: 'Model', value: vehicleData.model || 'Not provided' },
    { label: 'Vehicle Colour', value: vehicleData.vehicleColor || 'Not provided' },
    { label: 'VIN', value: vehicleData.vin || 'Not provided' },
    { label: 'Years in Service', value: vehicleData.serviceYears || 'Not provided' },
    { label: 'Plate Type', value: vehicleData.plateType || 'Not provided' },
    { label: 'Payload Capacity (kg)', value: vehicleData.payload || 'Not provided' },
    { label: 'Insurance Coverage (THB)', value: vehicleData.insuranceValue || 'Not provided' },
    {
      label: 'Container Compatibility',
      value:
        trailerOptions.box20 || trailerOptions.box40
          ? [
              trailerOptions.box20 ? '20 ft container' : null,
              trailerOptions.box40 ? '40 ft container' : null,
            ]
              .filter(Boolean)
              .join(', ')
          : 'Not specified',
    },
  ]

  const weightRows = [
    { label: 'Front Axle (kg)', value: vehicleData.weightFront || 'Not provided' },
    { label: 'Rear Axle (kg)', value: vehicleData.weightRear || 'Not provided' },
    { label: 'Gross Weight (kg)', value: vehicleData.weightTotal || 'Not provided' },
  ]

  const documentPreviews = [
    { id: 'avatar', label: 'Driver Portrait', preview: avatarPreview },
    { id: 'front', label: 'Front of Truck', preview: truckImages.front },
    { id: 'side', label: 'Side of Truck', preview: truckImages.side },
    { id: 'rear', label: 'Rear of Truck', preview: truckImages.rear },
    { id: 'plate', label: 'License Plate', preview: truckImages.plate },
    { id: 'registration', label: 'Registration Certificate', preview: vehicleDocs.registration },
    { id: 'insurance', label: 'Insurance Policy', preview: vehicleDocs.insurance },
    { id: 'ownership', label: 'Owner Identification', preview: vehicleDocs.ownership },
    { id: 'tax', label: 'Tax Receipt', preview: vehicleDocs.tax },
    ...(hasTrailer || trailerOptions.box20 || trailerOptions.box40
      ? [{ id: 'trailer', label: 'Trailer Plate', preview: truckImages.trailer }] as Array<{
          id: string
          label: string
          preview: string | null
        }>
      : []),
  ]

  return (
    <div className="review-screen" role="presentation">
      <div className="status-bar status-bar--inverse review-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>

      <header className="review-header">
        <button type="button" className="info-back" onClick={() => onBack('vehicle')} aria-label="Back to vehicle information">
          <span />
        </button>
        <h2>Review Submission</h2>
      </header>

      <StepIndicator current={5} total={5} />

      <main className="review-content">
        <section className="review-section">
          <div className="review-section-header">
            <h3 className="review-section-title">Driver Information</h3>
            <button type="button" className="review-edit" onClick={() => onBack('info')}>
              Edit
            </button>
          </div>
          <div className="review-card">
            <div className="review-rows">
              {driverRows.map((row) => (
                <div key={row.label} className="review-row">
                  <span>{row.label}</span>
                  <span>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="review-section">
          <div className="review-section-header">
            <h3 className="review-section-title">Vehicle Details</h3>
            <button type="button" className="review-edit" onClick={() => onBack('vehicle')}>
              Edit
            </button>
          </div>
          <div className="review-card">
            <div className="review-rows">
              {vehicleRows.map((row) => (
                <div key={row.label} className="review-row">
                  <span>{row.label}</span>
                  <span>{row.value}</span>
                </div>
              ))}
            </div>
            <div className="review-rows">
              {weightRows.map((row) => (
                <div key={row.label} className="review-row">
                  <span>{row.label}</span>
                  <span>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="review-section">
          <div className="review-section-header">
            <h3 className="review-section-title">Photos & Documents</h3>
            <button type="button" className="review-edit" onClick={() => onBack('vehicle')}>
              Edit
            </button>
          </div>
          <div className="review-card review-images">
            {documentPreviews.map((doc) => (
              <div key={doc.id} className="review-image">
                {doc.preview ? <img src={doc.preview} alt={doc.label} /> : <span>{doc.label} (pending upload)</span>}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="review-footer">
        <button type="button" className="btn btn-secondary" onClick={() => onBack('vehicle')}>
          Back
        </button>
        <button type="button" className="btn review-submit" onClick={onSubmit}>
          Submit
        </button>
      </footer>

      <div className="home-indicator home-indicator--raised" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

function VerificationScreen({ onBack, onVerified }: VerificationScreenProps) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''))
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(30)
  const [showSuccess, setShowSuccess] = useState(false)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (timer <= 0 || showSuccess) {
      return
    }
    const id = window.setTimeout(() => setTimer((value) => value - 1), 1000)
    return () => window.clearTimeout(id)
  }, [timer, showSuccess])

  const handleDigitChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    if (showSuccess) return
    const raw = event.target.value.replace(/\D/g, '')
    if (!raw) {
      const updated = [...digits]
      updated[index] = ''
      setDigits(updated)
      return
    }

    const char = raw.slice(-1)
    const updated = [...digits]
    updated[index] = char
    setDigits(updated)
    setError('')

    if (index < updated.length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
    if (showSuccess) return
    if ((event.key === 'Backspace' || event.key === 'Delete') && !digits[index] && index > 0) {
      const updated = [...digits]
      updated[index - 1] = ''
      setDigits(updated)
      inputRefs.current[index - 1]?.focus()
      event.preventDefault()
    }
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    if (showSuccess) return
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '')
    if (!pasted) {
      return
    }
    const updated = [...digits]
    for (let i = 0; i < updated.length; i += 1) {
      updated[i] = pasted[i] ?? ''
    }
    setDigits(updated)
    const nextIndex = Math.min(pasted.length, updated.length - 1)
    inputRefs.current[nextIndex]?.focus()
    setError('')
    event.preventDefault()
  }

  const handleVerify = () => {
    const entered = digits.join('')
    if (entered === EXPECTED_OTP) {
      setError('')
      setShowSuccess(true)
    } else {
      setError('Incorrect code, please enter 123456.')
    }
  }

  const handleResend = () => {
    if (showSuccess) return
    setDigits(Array(6).fill(''))
    setTimer(30)
    setError('')
    inputRefs.current[0]?.focus()
  }

  const isResendDisabled = timer > 0 || showSuccess
  const canVerify = digits.every((digit) => digit !== '')

  return (
    <div className={`verify-screen ${showSuccess ? 'verify-screen--success' : ''}`} role="presentation">
      <div className="status-bar status-bar--inverse review-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>

      <header className="review-header">
        <button type="button" className="info-back" onClick={onBack} aria-label="Back to review details" disabled={showSuccess}>
          <span />
        </button>
        <h2>Verify Identity</h2>
      </header>

      <main className="verify-content">
        <div className="verify-heading">
          <p>Enter the 6-digit OTP sent to</p>
          <h3>XXX-XXX-5678</h3>
          <p className="verify-ref">Ref: RELK</p>
        </div>

        <div className={`otp-inputs ${error ? 'otp-inputs--error' : ''}`}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element
              }}
              className={`otp-input ${error ? 'otp-input--error' : ''}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={handleDigitChange(index)}
              onKeyDown={handleKeyDown(index)}
              onPaste={index === 0 ? handlePaste : undefined}
              aria-label={`Digit ${index + 1}`}
              disabled={showSuccess}
            />
          ))}
        </div>

        {error && <p className="verify-error">{error}</p>}

        <button type="button" className="btn verify-submit" onClick={handleVerify} disabled={!canVerify || showSuccess}>
          Verify
        </button>

        <button type="button" className="verify-resend" onClick={handleResend} disabled={isResendDisabled}>
          Resend OTP {timer > 0 && !showSuccess ? `(${timer.toString().padStart(2, '0')})` : ''}
        </button>
      </main>

      {showSuccess && (
        <div className="verify-success-dialog">
          <div className="verify-success-icon">
            <span>✓</span>
          </div>
          <div className="verify-success-text">
            <p className="verify-success-title">Registration Complete!</p>
            <p className="verify-success-subtitle">Your submission has been verified successfully.</p>
          </div>
          <button type="button" className="btn verify-success-button" onClick={onVerified}>
            Go to Home
          </button>
        </div>
      )}

      <div className="home-indicator home-indicator--raised" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

function AccountPasswordOTPScreen({ onBack, onVerified }: AccountPasswordOTPScreenProps) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''))
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(30)
  const [showSuccess, setShowSuccess] = useState(false)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (timer <= 0 || showSuccess) {
      return
    }
    const id = window.setTimeout(() => setTimer((value) => value - 1), 1000)
    return () => window.clearTimeout(id)
  }, [timer, showSuccess])

  const handleDigitChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    if (showSuccess) return
    const raw = event.target.value.replace(/\D/g, '')
    if (!raw) {
      const updated = [...digits]
      updated[index] = ''
      setDigits(updated)
      return
    }

    const char = raw.slice(-1)
    const updated = [...digits]
    updated[index] = char
    setDigits(updated)
    setError('')

    if (index < updated.length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
    if (showSuccess) return
    if ((event.key === 'Backspace' || event.key === 'Delete') && !digits[index] && index > 0) {
      const updated = [...digits]
      updated[index - 1] = ''
      setDigits(updated)
      inputRefs.current[index - 1]?.focus()
      event.preventDefault()
    }
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    if (showSuccess) return
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '')
    if (!pasted) {
      return
    }
    const updated = [...digits]
    for (let i = 0; i < updated.length; i += 1) {
      updated[i] = pasted[i] ?? ''
    }
    setDigits(updated)
    const nextIndex = Math.min(pasted.length, updated.length - 1)
    inputRefs.current[nextIndex]?.focus()
    setError('')
    event.preventDefault()
  }

  const handleVerify = () => {
    const entered = digits.join('')
    if (entered === ACCOUNT_PASSWORD_OTP) {
      setError('')
      setShowSuccess(true)
    } else {
      setError('Incorrect code, please enter 251079.')
    }
  }

  const handleResend = () => {
    if (showSuccess) return
    setDigits(Array(6).fill(''))
    setTimer(30)
    setError('')
    inputRefs.current[0]?.focus()
  }

  const isResendDisabled = timer > 0 || showSuccess
  const canVerify = digits.every((digit) => digit !== '')

  return (
    <div className={`verify-screen ${showSuccess ? 'verify-screen--success' : ''}`} role="presentation">
      <div className="status-bar status-bar--inverse review-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>

      <header className="review-header">
        <button type="button" className="info-back" onClick={onBack} aria-label="Back" disabled={showSuccess}>
          <span />
        </button>
        <h2>Verify Identity</h2>
      </header>

      <main className="verify-content">
        <div className="verify-heading">
          <p>Enter the 6-digit OTP sent to</p>
          <h3>XXX-XXX-5678</h3>
          <p className="verify-ref">Ref: RELK</p>
        </div>

        <div className={`otp-inputs ${error ? 'otp-inputs--error' : ''}`}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element
              }}
              className={`otp-input ${error ? 'otp-input--error' : ''}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={handleDigitChange(index)}
              onKeyDown={handleKeyDown(index)}
              onPaste={index === 0 ? handlePaste : undefined}
              aria-label={`Digit ${index + 1}`}
              disabled={showSuccess}
            />
          ))}
        </div>

        {error && <p className="verify-error">{error}</p>}

        <button type="button" className="btn verify-submit" onClick={handleVerify} disabled={!canVerify || showSuccess}>
          Verify
        </button>

        <button type="button" className="verify-resend" onClick={handleResend} disabled={isResendDisabled}>
          I didn't receive the code <span style={{ color: '#0a8778', fontWeight: 600 }}>Resend</span> {timer > 0 && !showSuccess ? `(${timer.toString().padStart(2, '0')})` : ''}
        </button>
      </main>

      {showSuccess && (
        <div className="verify-success-dialog">
          <div className="verify-success-icon">
            <span>✓</span>
          </div>
          <div className="verify-success-text">
            <p className="verify-success-title">Password Changed!</p>
            <p className="verify-success-subtitle">Your password has been changed successfully.</p>
          </div>
          <button type="button" className="btn verify-success-button" onClick={onVerified}>
            Back to Account
          </button>
        </div>
      )}

      <div className="home-indicator home-indicator--raised" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

type DeleteAccountDialogProps = {
  onBack: () => void
  onConfirm: () => void
}

function DeleteAccountDialog({ onBack, onConfirm }: DeleteAccountDialogProps) {
  return (
    <>
      <div className="settings-screen" role="presentation">
        <div className="settings-status-bar" aria-hidden="true">
          <span className="status-time">9:41</span>
        </div>
        <header className="settings-header">
          <button type="button" className="settings-back" onClick={onBack} aria-label="Back">
            <img 
              src={SETTINGS_BACK_ICON} 
              alt="" 
              aria-hidden="true" 
              onLoad={(e) => {
                const fallback = e.currentTarget.parentElement?.querySelector('.settings-back-fallback') as HTMLElement;
                if (fallback) fallback.style.display = 'none';
              }}
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const fallback = target.parentElement?.querySelector('.settings-back-fallback') as HTMLElement;
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <span className="settings-back-fallback" aria-hidden="true">←</span>
          </button>
          <h1>Account</h1>
          <div className="settings-header-spacer" />
        </header>

        <main className="settings-content">
          <div className="settings-section">
            <div className="account-field">
              <label className="account-field-label">Username</label>
              <div className="account-field-row">
                <span className="account-field-value">pattharida.2024</span>
              </div>
            </div>

            <div className="account-field">
              <label className="account-field-label">Password</label>
              <div className="account-field-row">
                <span className="account-field-value">**********</span>
                <button
                  type="button"
                  className="account-edit-button"
                  aria-label="Edit password"
                  disabled
                >
                  <img src={PROFILE_EDIT_ICON} alt="" className="account-edit-icon" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="account-delete-container">
              <button type="button" className="account-delete-button">
                Delete Account
              </button>
            </div>
          </div>
        </main>

        <div className="home-indicator" aria-hidden="true">
          <span />
        </div>
      </div>

      <div className="delete-account-overlay" onClick={onBack}>
        <div className="delete-account-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="delete-account-dialog-content">
            <div className="delete-account-icon">
              <img src={DELETE_ACCOUNT_ICON} alt="" />
            </div>
            <h2 className="delete-account-title">You are about to delete your account</h2>
            <p className="delete-account-description">
              Deleting your account will permanently delete all your data
            </p>
            <ul className="delete-account-list">
              <li>Personal information</li>
              <li>Service history</li>
              <li>Related transaction data</li>
            </ul>
            <p className="delete-account-warning">
              After deleting the account, it cannot be recovered
            </p>
          </div>
          <div className="delete-account-actions">
            <button 
              type="button" 
              className="delete-account-confirm-button"
              onClick={onConfirm}
            >
              Delete Account
            </button>
            <button 
              type="button" 
              className="delete-account-cancel-button"
              onClick={onBack}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

type TermsOfServiceScreenProps = {
  onBack: () => void
}

function TermsOfServiceScreen({ onBack }: TermsOfServiceScreenProps) {
  return (
    <div className="terms-of-service-screen" role="presentation">
      <div className="settings-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>
      <header className="settings-header">
        <button type="button" className="settings-back" onClick={onBack} aria-label="Back">
          <img src={SETTINGS_BACK_ICON} alt="" aria-hidden="true" />
        </button>
        <h1>Terms of Service and Policy</h1>
        <div className="settings-header-spacer" />
      </header>

      <main className="terms-content">
        <div className="terms-section">
          <h2 className="terms-title">Truckers Driver Privacy Policy</h2>
          <p className="terms-date">Effective as of January 15, 2024</p>

          <div className="terms-text">
            <div className="terms-paragraph">
              <p>
                <strong>Information We Collect</strong> We collect information necessary to provide the Truckers app services to drivers, including information you provide directly and information we collect from your use of the app, such as:
              </p>
              <ul>
                <li>
                  <strong>Personal Information</strong>: such as name, email, phone number, and account information related to transportation
                </li>
                <li>
                  <strong>Driving Information</strong>: including information about trips, location (GPS), speed, selected routes, start and end times of transportation
                </li>
                <li>
                  <strong>Vehicle Information</strong>: including license plate number, vehicle type, and information related to the condition of the truck
                </li>
                <li>
                  <strong>Financial Information</strong>: information used for payment such as bank account details or credit card information
                </li>
                <li>
                  <strong>Communication Information</strong>: messages, conversations, or contacts through the app related to service provision
                </li>
              </ul>
            </div>

            <div className="terms-paragraph">
              <p>
                <strong>How We Use Information</strong> We will use your information in various ways, such as:
              </p>
              <ul>
                <li>Processing freight transportation requests</li>
                <li>Calculating service fees and payments</li>
                <li>Improving service provision and app development</li>
                <li>Contacting you to provide information about transportation status or notifications</li>
                <li>Improving your user experience</li>
                <li>Complying with legal requirements</li>
              </ul>
            </div>

            <div className="terms-paragraph">
              <p>
                <strong>Information Sharing</strong> We will not share your personal information with third parties, except in the following cases:
              </p>
              <ul>
                <li>
                  Service Providers We Hire: Companies or individuals we use for various services (such as payment services, data analysis) that have privacy policies protecting your information
                </li>
                <li>
                  Legal Compliance: In cases where we are legally obligated, such as providing information to government agencies or complying with court orders
                </li>
                <li>
                  Sharing Non-Identifiable Information: such as statistical data that does not identify individuals or data used for analysis to develop the app
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

type VehicleInformationScreenProps = {
  onBack: () => void
}

function VehicleInformationScreen({ onBack }: VehicleInformationScreenProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'photo'>('info')
  const [editingPhoto, setEditingPhoto] = useState<'front' | 'side' | 'rear' | null>(null)
  const [photoFiles, setPhotoFiles] = useState<{
    front: File | null
    side: File | null
    rear: File | null
  }>({
    front: null,
    side: null,
    rear: null,
  })
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<{
    front: string | null
    side: string | null
    rear: string | null
  }>({
    front: null,
    side: null,
    rear: null,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editingPhotoRef = useRef<'front' | 'side' | 'rear' | null>(null)

  const handleOpenPhotoPicker = (photoType: 'front' | 'side' | 'rear') => {
    setEditingPhoto(photoType)
    editingPhotoRef.current = photoType
  }

  const handleClosePhotoPicker = () => {
    setEditingPhoto(null)
    editingPhotoRef.current = null
  }

  const handleChooseFromGallery = () => {
    fileInputRef.current?.click()
  }

  const handleTakePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment')
      fileInputRef.current.click()
      fileInputRef.current.removeAttribute('capture')
    }
  }

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    const photoType = editingPhotoRef.current
    if (file && photoType) {
      const url = URL.createObjectURL(file)
      setPhotoFiles(prev => ({ ...prev, [photoType]: file }))
      setPhotoPreviewUrls(prev => {
        // Revoke old URL if exists
        if (prev[photoType]) {
          URL.revokeObjectURL(prev[photoType]!)
        }
        return { ...prev, [photoType]: url }
      })
      setEditingPhoto(null)
      editingPhotoRef.current = null
    }
    // Reset input
    if (event.target) {
      event.target.value = ''
    }
  }

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(photoPreviewUrls).forEach(url => {
        if (url) {
          URL.revokeObjectURL(url)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getPhotoUrl = (photoType: 'front' | 'side' | 'rear') => {
    if (photoPreviewUrls[photoType]) {
      return photoPreviewUrls[photoType]
    }
    switch (photoType) {
      case 'front':
        return VEHICLE_FRONT_IMAGE
      case 'side':
        return VEHICLE_SIDE_IMAGE
      case 'rear':
        return VEHICLE_REAR_IMAGE
    }
  }

  return (
    <div className="settings-screen" role="presentation">
      <div className="settings-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>
      <header className="settings-header">
        <button type="button" className="settings-back" onClick={onBack} aria-label="Back">
          <img 
            src={SETTINGS_BACK_ICON} 
            alt="" 
            aria-hidden="true" 
            onLoad={(e) => {
              const fallback = e.currentTarget.parentElement?.querySelector('.settings-back-fallback') as HTMLElement;
              if (fallback) fallback.style.display = 'none';
            }}
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const fallback = target.parentElement?.querySelector('.settings-back-fallback') as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <span className="settings-back-fallback" aria-hidden="true">←</span>
        </button>
        <h1>Vehicle Information</h1>
        <div className="settings-header-spacer" />
      </header>

      <div className="vehicle-information-tabs">
        <button 
          type="button"
          className={`vehicle-information-tab ${activeTab === 'info' ? 'vehicle-information-tab--active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          <span>Vehicle Information</span>
          {activeTab === 'info' && <div className="vehicle-information-tab-indicator" />}
        </button>
        <button 
          type="button"
          className={`vehicle-information-tab ${activeTab === 'photo' ? 'vehicle-information-tab--active' : ''}`}
          onClick={() => setActiveTab('photo')}
        >
          <span>Vehicle Photo</span>
          {activeTab === 'photo' && <div className="vehicle-information-tab-indicator" />}
        </button>
      </div>

      <main className="settings-content">
        {activeTab === 'info' ? (
          <div className="settings-section">
            <div className="vehicle-information-section">
              <div className="vehicle-information-header">
                <h3 className="vehicle-information-section-title">Registration Document</h3>
                <button type="button" className="account-edit-button" aria-label="Edit">
                  <img src={PROFILE_EDIT_ICON} alt="" className="account-edit-icon" aria-hidden="true" />
                </button>
              </div>

              <div className="vehicle-registration-image-container">
                <div className="vehicle-registration-image">
                  <img src={VEHICLE_REGISTRATION_IMAGE} alt="Registration document" />
                  <div className="vehicle-registration-overlay">
                    <p className="vehicle-registration-text">Click here to view image</p>
                  </div>
                </div>
                <button type="button" className="vehicle-camera-button" aria-label="Take photo">
                  <img src={VEHICLE_CAMERA_ICON} alt="" />
                </button>
              </div>

              <div className="vehicle-information-fields">
                <div className="account-field">
                  <label className="account-field-label">Registration Number</label>
                  <div className="account-field-row">
                    <span className="account-field-value">AB1234</span>
                    <button type="button" className="account-edit-button" aria-label="Edit">
                      <img src={PROFILE_EDIT_ICON} alt="" className="account-edit-icon" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="account-field">
                  <label className="account-field-label">Registration Province</label>
                  <div className="account-field-row">
                    <span className="account-field-value">Bangkok</span>
                    <button type="button" className="account-edit-button" aria-label="Edit">
                      <img src={PROFILE_EDIT_ICON} alt="" className="account-edit-icon" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="account-field">
                  <label className="account-field-label">Vehicle Brand</label>
                  <div className="account-field-row">
                    <span className="account-field-value">Isuzu</span>
                    <button type="button" className="account-edit-button" aria-label="Edit">
                      <img src={PROFILE_EDIT_ICON} alt="" className="account-edit-icon" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="account-field">
                  <label className="account-field-label">Vehicle Color</label>
                  <div className="account-field-row">
                    <span className="account-field-value">White</span>
                    <button type="button" className="account-edit-button" aria-label="Edit">
                      <img src={PROFILE_EDIT_ICON} alt="" className="account-edit-icon" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="account-field">
                  <label className="account-field-label">VIN</label>
                  <div className="account-field-row">
                    <span className="account-field-value">TBR1234567TH890123</span>
                    <button type="button" className="account-edit-button" aria-label="Edit">
                      <img src={PROFILE_EDIT_ICON} alt="" className="account-edit-icon" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="account-field">
                  <label className="account-field-label">Vehicle Type</label>
                  <div className="account-field-row">
                    <span className="account-field-value">10 Wheels</span>
                    <button type="button" className="account-edit-button" aria-label="Edit">
                      <img src={PROFILE_EDIT_ICON} alt="" className="account-edit-icon" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="settings-section">
            <div className="vehicle-photo-section">
              <button
                type="button"
                className="vehicle-photo-back-button"
                onClick={() => setActiveTab('info')}
                aria-label="Back to Vehicle Information"
              >
                <img src={SETTINGS_BACK_ICON} alt="" aria-hidden="true" />
                <span>Back to Vehicle Information</span>
              </button>
              <div className="vehicle-photo-item">
                <div className="vehicle-information-header">
                <h3 className="vehicle-information-section-title">Front Photo</h3>
                  <button 
                    type="button" 
                    className="account-edit-button" 
                    aria-label="Edit"
                    onClick={() => handleOpenPhotoPicker('front')}
                  >
                    <img src={PROFILE_EDIT_ICON} alt="" className="account-edit-icon" aria-hidden="true" />
                  </button>
                </div>
                <div className="vehicle-registration-image-container">
                  <div className="vehicle-registration-image">
                    <img src={getPhotoUrl('front')!} alt="Front of vehicle" />
                    <div className="vehicle-registration-overlay">
                      <p className="vehicle-registration-text">Tap here to view image</p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="vehicle-camera-button" 
                    aria-label="Take photo"
                    onClick={() => handleOpenPhotoPicker('front')}
                  >
                    <img src={VEHICLE_CAMERA_ICON} alt="" />
                  </button>
                </div>
              </div>

              <div className="vehicle-photo-item">
                <div className="vehicle-information-header">
                <h3 className="vehicle-information-section-title">Side Photo</h3>
                  <button 
                    type="button" 
                    className="account-edit-button" 
                    aria-label="Edit"
                    onClick={() => handleOpenPhotoPicker('side')}
                  >
                    <img src={PROFILE_EDIT_ICON} alt="" className="account-edit-icon" aria-hidden="true" />
                  </button>
                </div>
                <div className="vehicle-registration-image-container">
                  <div className="vehicle-registration-image">
                    <img src={getPhotoUrl('side')!} alt="Side of vehicle" />
                    <div className="vehicle-registration-overlay">
                      <p className="vehicle-registration-text">Tap here to view image</p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="vehicle-camera-button" 
                    aria-label="Take photo"
                    onClick={() => handleOpenPhotoPicker('side')}
                  >
                    <img src={VEHICLE_CAMERA_ICON} alt="" />
                  </button>
                </div>
              </div>

              <div className="vehicle-photo-item">
                <div className="vehicle-information-header">
                <h3 className="vehicle-information-section-title">Rear Photo</h3>
                  <button 
                    type="button" 
                    className="account-edit-button" 
                    aria-label="Edit"
                    onClick={() => handleOpenPhotoPicker('rear')}
                  >
                    <img src={PROFILE_EDIT_ICON} alt="" className="account-edit-icon" aria-hidden="true" />
                  </button>
                </div>
                <div className="vehicle-registration-image-container">
                  <div className="vehicle-registration-image">
                    <img src={getPhotoUrl('rear')!} alt="Rear of vehicle" />
                    <div className="vehicle-registration-overlay">
                      <p className="vehicle-registration-text">Tap here to view image</p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="vehicle-camera-button" 
                    aria-label="Take photo"
                    onClick={() => handleOpenPhotoPicker('rear')}
                  >
                    <img src={VEHICLE_CAMERA_ICON} alt="" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileSelect}
      />

      {/* Photo picker modal */}
      {editingPhoto ? (
        <div
          className="vehicle-photo-picker-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Select photo source"
          onClick={handleClosePhotoPicker}
        >
          <div
            className="vehicle-photo-picker"
            role="document"
            onClick={(event) => {
              event.stopPropagation()
            }}
          >
            <div className="vehicle-photo-picker__options">
              <button
                type="button"
                className="vehicle-photo-picker__option"
                onClick={handleTakePhoto}
              >
                <span aria-hidden="true">
                  <img src={CURRENT_JOBS_PICKER_CAMERA_ICON} alt="" />
                </span>
                Take Photo
              </button>
              <button
                type="button"
                className="vehicle-photo-picker__option vehicle-photo-picker__option--gallery"
                onClick={handleChooseFromGallery}
              >
                <span aria-hidden="true">
                  <img src={CURRENT_JOBS_PICKER_GALLERY_ICON} alt="" />
                </span>
                Choose from Gallery
              </button>
            </div>
            <button
              type="button"
              className="vehicle-photo-picker__cancel"
              onClick={handleClosePhotoPicker}
            >
              Cancel
            </button>
            <div className="home-indicator home-indicator--raised" aria-hidden="true">
              <span />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function VehicleDashboardScreen({ onBack }: { onBack: () => void }) {
  const [selectedTab, setSelectedTab] = useState<'day' | 'month' | 'year'>('year')
  const [selectedYear, setSelectedYear] = useState(2024)
  const [transportType, setTransportType] = useState('All transportation types')

  // Sample data - in a real app, this would come from an API
  const factoryVehicles = [
    { type: '12W', plate: 'DD-1234', jobs: 20, status: 'available' },
    { type: '12W', plate: 'DD-1234', jobs: 19, status: 'available' },
    { type: '12W', plate: 'DD-1234', jobs: 18, status: 'available' },
    { type: '12W', plate: 'DD-1234', jobs: 17, status: 'unavailable' },
    { type: '12W', plate: 'DD-1234', jobs: 16, status: 'unavailable' },
  ]

  const shippingCompanies = [
    { name: 'Shipping Company 1', jobs: 20, status: 'available' },
    { name: 'Shipping Company 2', jobs: 19, status: 'available' },
    { name: 'Shipping Company 3', jobs: 18, status: 'available' },
    { name: 'Shipping Company 4', jobs: 17, status: 'unavailable' },
    { name: 'Shipping Company 5', jobs: 16, status: 'unavailable' },
  ]

  const handleYearChange = (direction: 'prev' | 'next') => {
    setSelectedYear((prev) => (direction === 'next' ? prev + 1 : prev - 1))
  }

  return (
    <div className="vehicle-dashboard-screen">
      <div className="vehicle-dashboard-status-bar" aria-hidden="true">
        <span className="status-time">9:41</span>
      </div>

      <header className="vehicle-dashboard-header">
        <button type="button" className="vehicle-dashboard-back" onClick={onBack} aria-label="Back">
          <img src={VEHICLE_ARROW_LEFT_ICON} alt="" />
        </button>
        <h2 className="vehicle-dashboard-title">Vehicles</h2>
        <div className="vehicle-dashboard-header-spacer" />
      </header>

      <div className="vehicle-dashboard-tabs">
        <button
          type="button"
          className={`vehicle-dashboard-tab ${selectedTab === 'day' ? 'active' : ''}`}
          onClick={() => setSelectedTab('day')}
        >
          Day
        </button>
        <button
          type="button"
          className={`vehicle-dashboard-tab ${selectedTab === 'month' ? 'active' : ''}`}
          onClick={() => setSelectedTab('month')}
        >
          Month
        </button>
        <button
          type="button"
          className={`vehicle-dashboard-tab ${selectedTab === 'year' ? 'active' : ''}`}
          onClick={() => setSelectedTab('year')}
        >
          Year
        </button>
      </div>

      <div className="vehicle-dashboard-year-selector">
        <button
          type="button"
          className="vehicle-dashboard-year-nav"
          onClick={() => handleYearChange('prev')}
          aria-label="Previous year"
        >
          <img src={VEHICLE_NAV_BEFORE_ICON} alt="" />
        </button>
        <span className="vehicle-dashboard-year-text">{selectedYear}</span>
        <button
          type="button"
          className="vehicle-dashboard-year-nav"
          onClick={() => handleYearChange('next')}
          aria-label="Next year"
        >
          <img src={VEHICLE_NAV_NEXT_ICON} alt="" />
        </button>
      </div>

      <main className="vehicle-dashboard-content">
        <div className="vehicle-dashboard-filter">
          <select
            className="vehicle-dashboard-filter-select"
            value={transportType}
            onChange={(e) => setTransportType(e.target.value)}
          >
            <option>All transportation types</option>
            <option>Factory vehicles</option>
            <option>Shipping company vehicles</option>
          </select>
        </div>

        {/* Factory Vehicles Section */}
        <section className="vehicle-dashboard-section">
          <div className="vehicle-dashboard-section-header">
            <h3 className="vehicle-dashboard-section-title">Factory Transportation Vehicles</h3>
            <span className="vehicle-dashboard-section-comparison">Compared to year: {selectedYear - 1}</span>
          </div>

          <div className="vehicle-dashboard-summary-cards">
            <div className="vehicle-dashboard-summary-card">
              <div className="vehicle-dashboard-summary-icon vehicle-dashboard-summary-icon--truck">
                <img src={VEHICLE_TRUCK_ICON} alt="" />
              </div>
              <div className="vehicle-dashboard-summary-content">
                <p className="vehicle-dashboard-summary-label">Total Vehicles</p>
                <div className="vehicle-dashboard-summary-value">
                  <strong>2,000</strong>
                  <span className="vehicle-dashboard-summary-badge vehicle-dashboard-summary-badge--positive">
                    <img src={VEHICLE_ARROW_UP_ICON} alt="" />
                    2%
                  </span>
                </div>
              </div>
            </div>

            <div className="vehicle-dashboard-summary-card">
              <div className="vehicle-dashboard-summary-icon">
                <img src={VEHICLE_CANCEL_ICON} alt="" />
              </div>
              <div className="vehicle-dashboard-summary-content">
                <p className="vehicle-dashboard-summary-label">Available Vehicles</p>
                <div className="vehicle-dashboard-summary-value">
                  <strong>500</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="vehicle-dashboard-table">
            <div className="vehicle-dashboard-table-header">
              <div className="vehicle-dashboard-table-cell">Vehicle Type</div>
              <div className="vehicle-dashboard-table-cell">License Plate</div>
              <div className="vehicle-dashboard-table-cell">Number of Jobs</div>
              <div className="vehicle-dashboard-table-cell">Status</div>
            </div>

            {factoryVehicles.map((vehicle, index) => (
              <div key={index} className="vehicle-dashboard-table-row">
                <div className="vehicle-dashboard-table-cell">{vehicle.type}</div>
                <div className="vehicle-dashboard-table-cell">{vehicle.plate}</div>
                <div className="vehicle-dashboard-table-cell vehicle-dashboard-table-cell--center">
                  {vehicle.jobs}
                </div>
                <div className="vehicle-dashboard-table-cell">
                  <span
                    className={`vehicle-dashboard-status-badge ${
                      vehicle.status === 'available'
                        ? 'vehicle-dashboard-status-badge--available'
                        : 'vehicle-dashboard-status-badge--unavailable'
                    }`}
                  >
                    <img
                      src={
                        vehicle.status === 'available'
                          ? VEHICLE_STATUS_AVAILABLE_ICON
                          : VEHICLE_STATUS_UNAVAILABLE_ICON
                      }
                      alt=""
                    />
                    {vehicle.status === 'available' ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shipping Companies Section */}
        <section className="vehicle-dashboard-section">
          <div className="vehicle-dashboard-section-header">
            <h3 className="vehicle-dashboard-section-title">Shipping Company Transportation</h3>
            <span className="vehicle-dashboard-section-comparison">Compared to year: {selectedYear - 1}</span>
          </div>

          <div className="vehicle-dashboard-summary-cards">
            <div className="vehicle-dashboard-summary-card">
              <div className="vehicle-dashboard-summary-icon vehicle-dashboard-summary-icon--truck">
                <img src={VEHICLE_TRUCK_ICON} alt="" />
              </div>
              <div className="vehicle-dashboard-summary-content">
                <p className="vehicle-dashboard-summary-label">Total Vehicles</p>
                <div className="vehicle-dashboard-summary-value">
                  <strong>2,000</strong>
                  <span className="vehicle-dashboard-summary-badge vehicle-dashboard-summary-badge--positive">
                    <img src={VEHICLE_ARROW_UP_ICON} alt="" />
                    2%
                  </span>
                </div>
              </div>
            </div>

            <div className="vehicle-dashboard-summary-card">
              <div className="vehicle-dashboard-summary-icon">
                <img src={VEHICLE_CANCEL_ICON} alt="" />
              </div>
              <div className="vehicle-dashboard-summary-content">
                <p className="vehicle-dashboard-summary-label">Available Vehicles</p>
                <div className="vehicle-dashboard-summary-value">
                  <strong>500</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="vehicle-dashboard-table">
            <div className="vehicle-dashboard-table-header">
              <div className="vehicle-dashboard-table-cell">Shipping Company Name</div>
              <div className="vehicle-dashboard-table-cell">Number of Jobs</div>
              <div className="vehicle-dashboard-table-cell">Status</div>
            </div>

            {shippingCompanies.map((company, index) => (
              <div key={index} className="vehicle-dashboard-table-row">
                <div className="vehicle-dashboard-table-cell">{company.name}</div>
                <div className="vehicle-dashboard-table-cell vehicle-dashboard-table-cell--center">
                  {company.jobs}
                </div>
                <div className="vehicle-dashboard-table-cell">
                  <span
                    className={`vehicle-dashboard-status-badge ${
                      company.status === 'available'
                        ? 'vehicle-dashboard-status-badge--available'
                        : 'vehicle-dashboard-status-badge--unavailable'
                    }`}
                  >
                    <img
                      src={
                        company.status === 'available'
                          ? VEHICLE_STATUS_AVAILABLE_ICON
                          : VEHICLE_STATUS_UNAVAILABLE_ICON
                      }
                      alt=""
                    />
                    {company.status === 'available' ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button type="button" className="vehicle-dashboard-view-more">
            View More
          </button>
        </section>
      </main>

      <div className="home-indicator home-indicator--raised" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

export default App


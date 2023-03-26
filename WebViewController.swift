//  OnlineAppCreator.com
//  WebViewGold for iOS // webviewgold.com

/* PLEASE CHECK CONFIG.SWIFT FOR CONFIGURATION */
/* PLEASE CHECK CONFIG.SWIFT FOR CONFIGURATION */
/* PLEASE CHECK CONFIG.SWIFT FOR CONFIGURATION */

import UIKit
import AVFoundation
import UserNotifications
import WebKit
import StoreKit
import OneSignal
import GoogleMobileAds
import StoreKit
import SafariServices
import SwiftQRScanner
import SwiftyStoreKit
import FBAudienceNetwork
import AppTrackingTransparency
import Zip
import SystemConfiguration
import CoreLocation
import SwiftyGif

protocol IAPurchaceViewControllerDelegate
{
    func didBuyColorsCollection(collectionIndex: Int)
}
var AdmobBannerID = Constants.AdmobBannerID
var AdmobinterstitialID = Constants.AdmobinterstitialID
var showBannerAd = Constants.showBannerAd
var showFullScreenAd = Constants.showFullScreenAd
var showadAfterX = Constants.showadAfterX
var deeplinkingrequest = false
var usemystatusbarbackgroundcolor = true
var urlrender = true
var inapptabisopen = false
var notfirstpageload = false

var googleLoginUserAgent_iPhone = "Mozilla/5.0 (iPhone; CPU iPhone OS 15_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Mobile/15E148 Safari/604.1"
var googleLoginUserAgent_iPad = "Mozilla/5.0 (iPad; CPU OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1"
var facebookLoginUserAgent_iPhone = "Mozilla/5.0 (iPhone; CPU iPhone OS 15_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Mobile/15E148 Safari/604.1"
var facebookLoginUserAgent_iPad = "Mozilla/5.0 (iPad; CPU OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1"

var useragent_has_changed = false
var default_user_agent = ""
var loginHelperEnabled = false
var dynamicStatusBarEnabled = false

extension String {
    
    func slice(from: String, to: String) -> String? {
        
        return (range(of: from)?.upperBound).flatMap { substringFrom in
            (range(of: to, range: substringFrom..<endIndex)?.lowerBound).map { substringTo in
                String(self[substringFrom..<substringTo])
            }
        }
    }
    
    func fileName() -> String {
        return URL(fileURLWithPath: self).deletingPathExtension().lastPathComponent
    }
    
    func fileExtension() -> String {
        return URL(fileURLWithPath: self).pathExtension
    }
}
extension String {
    subscript(_ i: Int) -> String {
        let idx1 = index(startIndex, offsetBy: i)
        let idx2 = index(idx1, offsetBy: 1)
        return String(self[idx1..<idx2])
    }
    
    subscript (r: Range<Int>) -> String {
        let start = index(startIndex, offsetBy: r.lowerBound)
        let end = index(startIndex, offsetBy: r.upperBound)
        return String(self[start ..< end])
    }
    
    subscript (r: CountableClosedRange<Int>) -> String {
        let startIndex =  self.index(self.startIndex, offsetBy: r.lowerBound)
        let endIndex = self.index(startIndex, offsetBy: r.upperBound - r.lowerBound)
        return String(self[startIndex...endIndex])
    }
}



class WebViewController: UIViewController, OSSubscriptionObserver, GADBannerViewDelegate, GADInterstitialDelegate, SKStoreProductViewControllerDelegate,SKProductsRequestDelegate, SKPaymentTransactionObserver, FBInterstitialAdDelegate
{
    @IBOutlet var loadingSign: UIActivityIndicatorView!
    @IBOutlet var offlineImageView: UIImageView!
    @IBOutlet var lblText1: UILabel!
    @IBOutlet var lblText2: UILabel!
    @IBOutlet var btnTry: UIButton!
    @IBOutlet var statusbarView: UIView!
    @IBOutlet weak var bgView: UIImageView!
    
    var webView: WKWebView!
    var navigatorGeolocation = NavigatorGeolocation()
    var safariWebView: SFSafariViewController!
    
    var first_statusbarbackgroundcolor = statusBarBackgroundColor
    var bottombarView = UIView()
    var loginPopupWindow: WKWebView?
    var topLayout : NSLayoutConstraint?
    var backupTopValue : CGFloat?
    
    @IBOutlet weak var bannerView: GADBannerView!
    var interstitial: GADInterstitial!
    var isFirstTimeLoad = true
    var extendediap = true
    var localCount = 0
    var offlineswitchcount = 0
    var firsthtmlrequest = "true"
    
    var delegate: IAPurchaceViewControllerDelegate!
    
    var transactionInProgress = false
    var selectedProductIndex: Int!
    
    var productIDs: Array<String?> = []
    
    var productsArray: Array<SKProduct?> = []
    
    var interstitialAd: FBInterstitialAd!
    let fbInterstitialAdID: String = Constants.facebookAdsID
    var timer1: Timer?
    var activeFBAd = false
    
     private var observation: NSKeyValueObservation?
     deinit {
         observation?.invalidate()
     }
    
    private let progressBar: UIProgressView = {
        let progressBar = UIProgressView(progressViewStyle: .bar)
        progressBar.trackTintColor = .clear
        progressBar.progressTintColor = loadingIndicatorColor
        return progressBar
    }()
    
    override func traitCollectionDidChange(_ previousTraitCollection: UITraitCollection?) {
            super.traitCollectionDidChange(previousTraitCollection)
        
        // Auto UI changes are disabled when the Dynamic Status Bar is enabled
        if (!dynamicStatusBarEnabled) {
            
            updatePullToRefreshColours()
            
            if #available(iOS 13.0, *)
            {
                // Turned to light mode
                if self.traitCollection.userInterfaceStyle == .light {
                    
                    self.statusbarView.backgroundColor = statusBarBackgroundColor
                    view.backgroundColor = statusBarBackgroundColor
                    
                    if (statusBarTextColor == "white"){
                        self.navigationController!.navigationBar.barStyle = .black
                    } else if (statusBarTextColor == "black") {
                        self.navigationController!.navigationBar.barStyle = .default
                    }
                    
                    if (bottombar) {
                        bottombarView.backgroundColor = bottombarBackgroundColor
                    }
                }
                
                // Turned to dark mode
                if self.traitCollection.userInterfaceStyle == .dark {
                    
                    self.statusbarView.backgroundColor = darkModeStatusBarBackgroundColor
                    view.backgroundColor = darkModeStatusBarBackgroundColor
                    
                    if (darkModeStatusBarTextColor == "black"){
                        let appDelegate = UIApplication.shared.delegate as! AppDelegate
                        appDelegate.deactivatedarkmode()
                    } else if (darkModeStatusBarTextColor == "white") {
                        self.navigationController!.navigationBar.barStyle = .black
                    }
                    
                    if (bottombar) {
                        bottombarView.backgroundColor = darkmodeBottombarBackgroundColor
                    }
                }
            }
        }
    }
    
    override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
        if (useLoadingProgressBar && notfirstpageload && (keyPath == "estimatedProgress")) {

            let progress = Float(self.webView.estimatedProgress);
            self.progressBar.setProgress(progress, animated: true);
            
            if (progress == 1.0) {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    self.progressBar.isHidden = true;
                    self.progressBar.progress = 0.0;
                }
            } else {
                self.progressBar.isHidden = false;
            }
        }
    }
    
    override func viewDidAppear(_ animated: Bool) {
        
        if (useLoadingProgressBar) {
            
            self.webView.addObserver(self, forKeyPath: "estimatedProgress", options: .new, context: nil);
            useLoadingSign = false
            
            webView.addSubview(progressBar)
            progressBar.frame = CGRect(x: 0, y: 0, width: webView.frame.size.width, height: 0)
            
            // Can use this code to change the thickeness (y) of the loading bar (scales can differ on iPhones VS iPads)
    //        if (UIDevice.current.userInterfaceIdiom == .pad) {
    //            progressBar.transform = progressBar.transform.scaledBy(x: 1, y: 1.2)
    //        } else {
    //            progressBar.transform = progressBar.transform.scaledBy(x: 1, y: 0.8)
    //        }
            
            progressBar.setProgress(0, animated: true)
        }
        
        default_user_agent = WKWebView().value(forKey: "userAgent") as! String;
        self.backupTopValue = self.topLayout?.constant
        
        var orientation = ""
        
        //if IPAD
        if ( UIDevice.current.userInterfaceIdiom == .pad){
          orientation = orientationipad
        } else  if ( UIDevice.current.userInterfaceIdiom == .phone) {
            orientation = orientationiphone
        }
        
        if orientation == "portrait" {
            let value = UIInterfaceOrientation.portrait.rawValue
            UIDevice.current.setValue(value, forKey: "orientation")
            AppDelegate.AppUtility.lockOrientation(.portrait)
        }
        
        else if orientation == "landscape" {
            let value = UIInterfaceOrientation.landscapeLeft.rawValue
            UIDevice.current.setValue(value, forKey: "orientation")
            AppDelegate.AppUtility.lockOrientation(.landscapeLeft)
        }
        let appIsOnline: Int
        
        //Prüfen ob die App mit dem Internet verbunden ist
        if InternetConnectionManager.isConnectedToNetwork(){
            
            print("Verbunden")
            appIsOnline = 1
        }
        else
        {
            
            print("nicht verbunden")
            appIsOnline = 0
            
        }
        
        //Wenn die App verbunden ist, wird der aktuelle .zip File geladen
        if Constants.zipfiledownloadfromserver {
        if appIsOnline == 1 {
            
            let fileNameToDelete = Constants.zipfilename
            var filePath = ""

            // Fine documents directory on device
            let paths = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)
            let documentDirectory = paths[0]
            filePath = documentDirectory.appendingFormat("/"+Constants.zipfileextractpath+"/" + fileNameToDelete)

            do {
                let fileManager = FileManager.default

                //Prüfen ob die Datei existiert
                if fileManager.fileExists(atPath: filePath) {
                    //Datei löschen
                    try fileManager.removeItem(atPath: filePath)
                    print("Datei gelöscht"+filePath)
                } else {
                    print("Datei existiert nicht")
                }

            }
            catch let error as NSError {
                print("An error took place: \(error)")
            }
            
            //Prüfen ob das Verzeichnis existiert, bzw. es erstellen wenn es nicht existiert
            let documentsPATH:URL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
            let destinationPATH = documentsPATH.appendingPathComponent(Constants.zipfileextractpath)
            if !FileManager.default.fileExists(atPath: destinationPATH.path) {
                
                do {
                    try FileManager.default.createDirectory(atPath: destinationPATH.path, withIntermediateDirectories: true, attributes: nil)
                    print("Verzeichniss erstellt")
                } catch {
                    print(error.localizedDescription)
                    print("Verzeichniss nicht erstellt")
                }
            }
            
            else {
                
                print("Verzeichniss existiert");
                
            }
            
            //Die Ziel URL erstellen
            let documentsUrl:URL =  FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
            let destinationFileUrl = documentsUrl.appendingPathComponent(Constants.zipfileextractpath+"/"+Constants.zipfilename)
            
            //Die Quell URL erstellen
            let fileURL = URL(string: Constants.zipfileremoteurl)
            let fileURLProg = URL(string: Constants.zipfileremoteurl)!

            let sessionConfig = URLSessionConfiguration.default
            let session = URLSession(configuration: sessionConfig)
         
            let request = URLRequest(url:fileURL!)
            
            let progressTask = URLSession.shared.dataTask(with: fileURLProg)
            
            let alert = UIAlertController(title: Constants.zipfilepopuptitle, message: Constants.zipfilepopupmessage, preferredStyle: .alert)
            
            DispatchQueue.main.async {
                //Das Popup erstellen
                
                self.present(alert, animated: true, completion: nil)

                //Das Popup 10 Sekunden anzeigen
                let when = DispatchTime.now() + 10
                DispatchQueue.main.asyncAfter(deadline: when){
                }
            }
            //Den Fortschritt anzeigen
            observation = progressTask.progress.observe(\.fractionCompleted) { progress, _ in
              print("progress: ", progress.fractionCompleted)
            }

            progressTask.resume()
            
            let task = session.downloadTask(with: request) { (tempLocalUrl, response, error) in
                
                //Das Popup ausblenden
                DispatchQueue.main.async {
                    alert.dismiss(animated: true, completion: nil)
                }
                if let tempLocalUrl = tempLocalUrl, error == nil {
                    // Success
                    if let statusCode = (response as? HTTPURLResponse)?.statusCode {
                        
                        print("Successfully downloaded. Status code: \(destinationFileUrl)")
                                            }
                    do {
                        try FileManager.default.copyItem(at: tempLocalUrl, to: destinationFileUrl)
                        print("Datei kopiert");
                        
                        do {
                            
                            let documentsPATH:URL =  FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
                            let filePath = documentsPATH.appendingPathComponent(Constants.zipfileextractpath+"/"+Constants.zipfilename)
                            
                            let documentsDirectory = FileManager.default.urls(for:.documentDirectory, in: .userDomainMask)[0]
                            let destinationDirectory = documentsPATH.appendingPathComponent(Constants.zipfileextractpath)

                            try Zip.unzipFile(filePath, destination: destinationDirectory, overwrite: true, password: "password", progress: { (progress) -> () in
                                print(progress)
                            }) // Unzip

                        }
                        catch {
                          print("Something went wrong")
                        }
                        
                    } catch (let writeError) {
                        print("Error creating a file \(destinationFileUrl) : \(writeError)")
                    }
                    
                } else {
                    print("Error took place while downloading a file. Error description: %@", error?.localizedDescription);
                }
            }
            task.resume()

        }
        
    }
        
        if(UserDefaults.standard.bool(forKey: "isFromPush")){
            Open_NotificationUrl()
            UserDefaults.standard.set(false, forKey: "isFromPush")
        }
        
    }
    
//
//    // Specify the orientation.
//    override open var supportedInterfaceOrientations: UIInterfaceOrientationMask {
//       return .landscapeLeft
//    }
//

    override func viewDidLoad()
    {
        super.viewDidLoad()
        
        // Check if device is eligible for bottombar feature
        if (bottombar) {
            if #available(iOS 11.0, *) {
                // Check if the device has a home button (bottomSafeArea = 0)
                let window = UIApplication.shared.keyWindow
                let bottomSafeArea = window?.safeAreaInsets.bottom
                let isiPad = UIDevice.current.userInterfaceIdiom == .pad
                if ((bottomSafeArea == 0) || (!iPadBottombar && isiPad)) {
                    bottombar = false
                } else {
                    bottombarView.backgroundColor = bottombarBackgroundColor
                }
            }
        }
        
        if #available(iOS 14, *) {
            print("ADS AUTH STATUS",ATTrackingManager.trackingAuthorizationStatus.rawValue)
            if(ATTrackingManager.trackingAuthorizationStatus.rawValue == 2){
               
                //DISABLE AD LIBRARIES:
                if (!Constants.ATTDeniedShowAds) {
                    Constants.useFacebookAds = false;
                    showBannerAd = false;
                    showFullScreenAd = false;
                }
            }
        }
        
//        ads will display every after n sec
        if(Constants.useFacebookAds == true && Constants.useTimedAds){
            timer1 = Timer.scheduledTimer(withTimeInterval: Constants.showFBAdsEveryNSeconds, repeats: true, block: { (timer) in
                
                print("Exists an active FB Ad?", self.activeFBAd)
                if( self.activeFBAd == false) {
                    self.DisplayAd()
                }
                self.activeFBAd = true
                
            })
        }
        
        self.setNeedsStatusBarAppearanceUpdate()
        
        self.navigationController?.navigationBar.isHidden = true
        selectedProductIndex = 0
        
        let langStr = Locale.current.languageCode
        loadingSign.color = loadingIndicatorColor
        if Constants.appendlanguage == true{
            
            if webviewurl != ""{
                if let range:Range<String.Index> = webviewurl.range(of: "?") {
                    webviewurl = "\(webviewurl)&webview_language=\(langStr!)"
                }else{
                    webviewurl = "\(webviewurl)?webview_language=\(langStr!)"
                }
                
            }
        }
        
        print(webviewurl)
        bgView.isHidden = true
        if (splashScreenEnabled && remainSplashOption) {
            loadingSign.isHidden = true
            bgView.isHidden = false
            do {
                let gif = try UIImage(gifName: "splash",levelOfIntegrity: 1)
                let gifManager = SwiftyGifManager(memoryLimit:100)
                bgView.setGifImage(gif, manager: gifManager)
            } catch {
                print(error)
            }
            self.statusbarView.backgroundColor = Constants.splshscreencolor
            view.backgroundColor = Constants.splshscreencolor
        }
        
        
        productIDs.append(Constants.AppBundleIdentifier)
        
        requestProductInfo()
        
        
        SKPaymentQueue.default().add(self as SKPaymentTransactionObserver)
        
        
        
        
        
        NotificationCenter.default.addObserver(self, selector: #selector(OpenWithExternalLink), name: NSNotification.Name(rawValue: "OpenWithExternalLink"), object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(Open_NotificationUrl), name: NSNotification.Name(rawValue: "OpenWithNotificationURL"), object: nil)
        var osURL = purchasecode;
        localCount = 0
        if showBannerAd {
            bannerView.isHidden = false
            bannerView.adUnitID = AdmobBannerID
            bannerView.adSize = kGADAdSizeSmartBannerPortrait
            bannerView.rootViewController = self
            bannerView.load(GADRequest())
        }else{
            bannerView.isHidden = true
        }
        if showFullScreenAd && !Constants.useFacebookAds {
            interstitial = createAndLoadInterstitial()
        }
        
        isFirstTimeLoad = true
        
        if(Constants.kPushEnabled)
        {
            OneSignal.add(self as OSSubscriptionObserver)
        }
        
        let audioSession = AVAudioSession.sharedInstance()
        
        do {
            try audioSession.setCategory(AVAudioSession.Category(rawValue: convertFromAVAudioSessionCategory(AVAudioSession.Category.playback)))
        }
        catch {
        }
        
        
        //Ensures that app has custom idle settings (dark screen)
        UIApplication.shared.isIdleTimerDisabled = preventsleep;
        
        switch UIDevice.current.userInterfaceIdiom {
        case .phone:
            if useragent_iphone.isEqual("")
            {
                
            }
            else
            {
                let customuseragent = [
                    "UserAgent" : useragent_iphone
                ]
                
                UserDefaults.standard.register(defaults: customuseragent)
            }
            
        case .pad:
            if useragent_ipad.isEqual("")
            {
                
            }
            else
            {
                let customuseragent = [
                    "UserAgent" : useragent_ipad
                ]
                
                UserDefaults.standard.register(defaults: customuseragent)
            }
            
        case .unspecified:
            if useragent_iphone.isEqual("")
            {
                
            }
            else
            {
                let customuseragent = [
                    "UserAgent" : useragent_iphone
                ]
                
                UserDefaults.standard.register(defaults: customuseragent)
            }
        case .tv:
            print("tv");
        case .carPlay:
            print("carplay");
        case .mac:
            break
        @unknown default:
            break
        }
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        webView = WKWebView(frame: UIScreen.main.bounds, configuration: config)
        webView.navigationDelegate = self
        webView.uiDelegate = self
        addWebViewToMainView(webView)
        switch UIDevice.current.userInterfaceIdiom {
        case .phone:
            if useragent_iphone.isEqual("")
            {
                
            }
            else
            {
                webView.customUserAgent = useragent_iphone
            }
        case .unspecified:
            break
        case .pad:
            if useragent_ipad.isEqual("")
            {
                
            }
            else
            {
                webView.customUserAgent = useragent_ipad
            }
        case .tv:
            break
        case .carPlay:
            break
        case .mac:
            break
        @unknown default:
            break
        }
        let defaults = UserDefaults.standard
        let age = defaults.integer(forKey: "age")
        let savedOSurl = defaults.string(forKey: "osURL")
        let savedOSurltwo = defaults.string(forKey: "osURL2")
        #if DEBUG
        if (age != 1 || savedOSurl != osURL){
            self.download(deep: osURL)
        }
        if (savedOSurltwo == "1"){
            self.extendediap = false
        }
        #endif
        let phonecheck = UIScreen.main.bounds
        let statusbar: CGFloat = 20
        
        if phonecheck.size.height == 667 - statusbar
        {
            offlineImageView.frame = CGRect(x: CGFloat(103), y: CGFloat(228), width: CGFloat(170), height: CGFloat(170))
            lblText1.frame = CGRect(x: CGFloat(40), y: CGFloat(400), width: CGFloat(295), height: CGFloat(50))
            lblText2.frame = CGRect(x: CGFloat(25), y: CGFloat(435), width: CGFloat(326), height: CGFloat(50))
            btnTry.frame = CGRect(x: CGFloat(110), y: CGFloat(520), width: CGFloat(150), height: CGFloat(20))
        }
        
        if phonecheck.size.height == 736 - statusbar
        {
            offlineImageView.frame = CGRect(x: CGFloat(123), y: CGFloat(205), width: CGFloat(170), height: CGFloat(170))
            lblText1.frame = CGRect(x: CGFloat(60), y: CGFloat(346), width: CGFloat(295), height: CGFloat(50))
            lblText2.frame = CGRect(x: CGFloat(44), y: CGFloat(374), width: CGFloat(326), height: CGFloat(50))
            btnTry.frame = CGRect(x: CGFloat(132), y: CGFloat(453), width: CGFloat(150), height: CGFloat(20))
        }
        
        if #available(iOS 13.0, *)
        {
            if self.traitCollection.userInterfaceStyle != .dark {
                UIApplication.shared.applicationIconBadgeNumber = 0
            }
        }
        let url = URL(string: webviewurl)!
        host = url.host ?? ""
        
        if (preventoverscroll)
        {
            self.webView.scrollView.bounces = false
        }
        if (pulltorefresh && !preventoverscroll) {
            configurePullToRefresh()
        }
        if (hideverticalscrollbar)
        {
            webView.scrollView.showsVerticalScrollIndicator = false
        }
        if (hidehorizontalscrollbar)
        {
            webView.scrollView.showsHorizontalScrollIndicator = false
        }
        if (deletecache)
        {
            URLCache.shared.removeAllCachedResponses()
            URLCache.shared.removeAllCachedResponses()
            let config = WKWebViewConfiguration()
            config.websiteDataStore = WKWebsiteDataStore.nonPersistent()
            config.allowsInlineMediaPlayback = true
            config.mediaTypesRequiringUserActionForPlayback = []
            HTTPCookieStorage.shared.removeCookies(since: Date.distantPast)
            WKWebsiteDataStore.default().fetchDataRecords(ofTypes: WKWebsiteDataStore.allWebsiteDataTypes()) { records in
                records.forEach { record in
                    WKWebsiteDataStore.default().removeData(ofTypes: record.dataTypes, for: [record], completionHandler: {})
                }
            }
            
        }
        
        view.bringSubviewToFront(loadingSign)
        
        webView.scrollView.bouncesZoom = false
        webView.allowsLinkPreview = false
        webView.autoresizingMask = ([.flexibleHeight, .flexibleWidth])
        let webConfiguration = WKWebViewConfiguration()
        webConfiguration.allowsInlineMediaPlayback = true
        
        offlineImageView.isHidden = true
        loadingSign.stopAnimating()
        loadingSign.isHidden = true
        btnTry.setTitle(offlinebuttontext, for: .normal)
        btnTry.setTitle(offlinebuttontext, for: .selected)
        lblText1.text = screen1
        lblText2.text = screen2
        
        lblText1.isHidden = true
        lblText2.isHidden = true
        btnTry.isHidden = true
        
        timer?.invalidate()
        
        let onlinecheck = url.absoluteString
        
        if (uselocalhtmlfolder)
        {
            let urllocal = URL(fileURLWithPath: Bundle.main.path(forResource: "index", ofType: "html")!)
            webView.load(URLRequest(url: urllocal))
        }
        else
        {
            if onlinecheck.count == 0
            {
                offlineImageView.isHidden = false
                webView.isHidden = true
                lblText1.isHidden = false
                lblText2.isHidden = false
                btnTry.isHidden = false
                loadingSign.isHidden = false
                if (usemystatusbarbackgroundcolor)
                {
                    self.statusbarView.backgroundColor = .white
                    view.backgroundColor = .white
                }
                print("Test1")
                
                timer = Timer.scheduledTimer(timeInterval: 1.0, target: self, selector: #selector(startTimer), userInfo: nil, repeats: true)
                
            }
            else
            {
                loadWeb()
            }
        }
        self.perform(#selector(checkForAlertDisplay), with: nil, afterDelay: 0.5)
    }
    
    func configurePullToRefresh() {
        webView.scrollView.refreshControl = UIRefreshControl()
        webView.scrollView.refreshControl?.addTarget(self, action:
                                                #selector(didPullToRefresh),
                                                for: .valueChanged)
        updatePullToRefreshColours()
    }
    
    func updatePullToRefreshColours() {
        webView.scrollView.refreshControl?.tintColor = pulltorefresh_loadingsigncolour_lightmode
        webView.scrollView.refreshControl?.backgroundColor = pulltorefresh_backgroundcolour_lightmode
        if #available(iOS 13.0, *)
        {
            if self.traitCollection.userInterfaceStyle == .dark {
                webView.scrollView.refreshControl?.tintColor = pulltorefresh_loadingsigncolour_darkmode
                webView.scrollView.refreshControl?.backgroundColor = pulltorefresh_backgroundcolour_darkmode
            }
        }
    }
    
    @objc func didPullToRefresh() {
        // Remove general loading sign
        if useLoadingSign {
            useLoadingSign = false
        }
        // Update content
        webView.reload()
        // Dismiss the refresh control
        DispatchQueue.main.async {
           self.webView.scrollView.refreshControl?.endRefreshing()
       }
    }
    
    override func viewWillAppear(_ animated: Bool)
    {
        if UserDefaults.standard.value(forKey: "IsPurchase")as! String == "YES"
        {
//            receiptValidation()
            receiptValidation2()
        }
    }
    
    @IBAction func AppInPurchaseBtnAction(_ sender: Any)
    {
        showActions(str: "Testing")
    }
    
    func requestProductInfo() {
        if SKPaymentQueue.canMakePayments()
        {
            
            let productIdentifiers = NSSet(array: productIDs as [Any])
            let productRequest = SKProductsRequest(productIdentifiers: productIdentifiers as Set<NSObject> as! Set<String>)
            
            productRequest.delegate = self
            productRequest.start()
        }
        else
        {
            print("Cannot perform In App Purchases.")
        }
    }
    
    func productsRequest(_ request: SKProductsRequest, didReceive response: SKProductsResponse) {
        if response.products.count != 0 {
            for product in response.products {
                productsArray.append(product)
            }
        }
        else {
            print("There are no products.")
        }
    }
    
    func showActions(str:String)
    {
        let str1 = str.slice(from: "=", to: "&")// "package="
        if str1 == nil{
            return
        }
        let package = str1!
        
        var sucessuri = "no"
        var expireduri = "no"
        
        if let range:Range<String.Index> = str.range(of: "expired_url=") {
            let index: Int = str.distance(from: str.startIndex, to: range.lowerBound)
            let firstindex = index + 12
            expireduri = str[firstindex..<str.count]
            sucessuri = str.slice(from: "successful_url=", to: "&")!
        }else{
            let range1:Range<String.Index> = str.range(of: "successful_url=")!
            let index: Int = str.distance(from: str.startIndex, to: range1.lowerBound)
            let firstindex = index + 15
            sucessuri = str[firstindex..<str.count]
        }
        UserDefaults.standard.setValue(expireduri, forKey: package)
        self.purchase(packgeid: package, atomically: false, succesurl: sucessuri, expireurl: expireduri)
        
    }
    
    func purchase(packgeid:String, atomically: Bool,succesurl:String,expireurl:String) {
        
        //NetworkActivityIndicatorManager.networkOperationStarted()
        print(packgeid)
        showIndicator()
        SwiftyStoreKit.purchaseProduct(packgeid, atomically: atomically) { [self] result in
            //NetworkActivityIndicatorManager.networkOperationFinished()
            print(result)
            var checkstatus = false
            if case .success(let purchase) = result {
                let downloads = purchase.transaction.downloads
                checkstatus = true
                if !downloads.isEmpty {
                    SwiftyStoreKit.start(downloads)
                }
                // Deliver content from server, then:
                if purchase.needsFinishTransaction {
                    SwiftyStoreKit.finishTransaction(purchase.transaction)
                }
            }
            if case .error(let error) = result {
                print(error)
            }
            
            if checkstatus == true{
                let succesurl2 = URL (string: succesurl)
                let requestObj2 = URLRequest(url: succesurl2!)
                self.webView.load(requestObj2)
            }else{
                print(expireurl)
                if expireurl != "no"{
                    let expireurl2 = URL (string: expireurl)
                    let expireurl2obj = URLRequest(url: expireurl2!)
                    self.webView.load(expireurl2obj)
                }
            }
            if let alert = self.alertForPurchaseResult(result) {
                self.showAlert(alert)
            }
            hideIndicator()
        }
    }
    
    func paymentQueue(_ queue: SKPaymentQueue, updatedTransactions transactions: [SKPaymentTransaction])
    {
        for transaction in transactions
        {
            switch transaction.transactionState
            {
            case SKPaymentTransactionState.purchased:
                print("Transaction completed successfully.")
                SKPaymentQueue.default().finishTransaction(transaction)
                transactionInProgress = false
                
                UserDefaults.standard.setValue("YES", forKey: "IsPurchase")
                
                let url = URL (string: Constants.iapsuccessurl)
                let requestObj = URLRequest(url: url!)
                bannerView.isHidden = true
//                webView.load(requestObj)
                
            case SKPaymentTransactionState.failed:
                print("Transaction failed");
                SKPaymentQueue.default().finishTransaction(transaction)
                transactionInProgress = false
                UserDefaults.standard.setValue("NO", forKey: "IsPurchase")
                
            default:
                print(transaction.transactionState.rawValue)
            }
        }
    }
    
    func productViewControllerDidFinish(_ viewController: SKStoreProductViewController)
    {
        viewController.dismiss(animated: true, completion: nil)
    }
    
    @objc func OpenWithExternalLink()
    {
        if (ShowExternalLink){
            let user = UserDefaults.standard
            if user.url(forKey: "DeepLinkUrl") != nil{
                let str = user.value(forKey: "DeepLinkUrl") as! String
                var newurl = str.replacingOccurrences(of: "www.", with: "")
                newurl = newurl.replacingOccurrences(of: "https://", with: "")
                newurl = newurl.replacingOccurrences(of: "http://", with: "")
                
                host = newurl
                webviewurl = "\(user.value(forKey: "DeepLinkUrl") ?? "")"
                loadWeb()
                
                // Closes the inapp tab if it is open to show the deep link
                if (inapptabisopen) {
                    dismiss(animated: true, completion: nil)
                }
            }
        }
    }
    
    @objc func Open_NotificationUrl()
    {
        let user = UserDefaults.standard
        if user.url(forKey: "Noti_Url") != nil{
            let str = user.value(forKey: "Noti_Url") as! String
            var newurl = str.replacingOccurrences(of: "www.", with: "")
            newurl = newurl.replacingOccurrences(of: "https://", with: "")
            newurl = newurl.replacingOccurrences(of: "http://", with: "")
            
            if (Constants.kPushOpenDeeplinkInBrowser){
                let url3 = URL (string: str)
                self.open(scheme: url3!)
                loadWeb()
            }
            else {
                host = newurl
                webviewurl = "\(user.value(forKey: "Noti_Url") ?? "")"
                loadWeb()
            }
            UserDefaults.standard.set(false, forKey: "isFromPush")
        }
    }
    
    func createAndLoadInterstitial() -> GADInterstitial
    {
        var interstitial = GADInterstitial(adUnitID: AdmobinterstitialID)
        interstitial.delegate = self
        interstitial.load(GADRequest())
        return interstitial
    }
    
    func interstitialDidDismissScreen(_ ad: GADInterstitial)
    {
        interstitial = createAndLoadInterstitial()
    }
    
    func presentInterstitial()
    {
        if interstitial.isReady
        {
            interstitial.present(fromRootViewController: self)
        }
    }
    
    func adViewDidReceiveAd(_ bannerView: GADBannerView)
    {
        print("adViewDidReceiveAd")
    }
    
    func adView(_ bannerView: GADBannerView,
                didFailToReceiveAdWithError error: GADRequestError)
    {
        print("adView:didFailToReceiveAdWithError: \(error.localizedDescription)")
    }
    
    func adViewWillPresentScreen(_ bannerView: GADBannerView)
    {
        print("adViewWillPresentScreen")
    }
    
    
    func adViewWillDismissScreen(_ bannerView: GADBannerView)
    {
        print("adViewWillDismissScreen")
    }
    
    func adViewDidDismissScreen(_ bannerView: GADBannerView)
    {
        print("adViewDidDismissScreen")
    }
    
    
    func adViewWillLeaveApplication(_ bannerView: GADBannerView)
    {
        print("adViewWillLeaveApplication")
    }
    
    override func didReceiveMemoryWarning()
    {
        super.didReceiveMemoryWarning()
    }
    
    @objc func startTimer() {
        clickToBtnTry(1)
    }
    
    var timer: Timer?
    
    override func viewWillTransition(to size: CGSize, with coordinator: UIViewControllerTransitionCoordinator) {
            super.viewWillTransition(to: size, with: coordinator)
            coordinator.animate(alongsideTransition: nil) { (context) in
                if (UIDevice.current.userInterfaceIdiom == .phone){
                    self.resetPositions()
                }
            }
        }
    
    func resetPositions() {
       if UIApplication.shared.statusBarOrientation.isLandscape {
           self.statusbarView.isHidden = true
           self.topLayout?.constant = 0
           if let newLayout = self.topLayout {
               view.addConstraint(newLayout)
           }
        } else {
            self.statusbarView.isHidden = false
            self.topLayout?.constant = self.backupTopValue ?? 25
            if let newLayout = self.topLayout{
                view.addConstraint(newLayout)
            }
        }
    }
    
    @IBAction func clickToBtnTry(_ sender: Any)
    {
        offlineImageView.isHidden = true
        lblText1.isHidden = true
        lblText2.isHidden = true
        btnTry.isHidden = true
        loadingSign.isHidden = false
        loadingSign.startAnimating()
        
        timer?.invalidate()
        
        webView.isHidden = false
        if (usemystatusbarbackgroundcolor)
        {
            self.statusbarView.backgroundColor = statusBarBackgroundColor
            view.backgroundColor = statusBarBackgroundColor
            
            if #available(iOS 13.0, *)
            {
                if self.traitCollection.userInterfaceStyle == .dark {
                    self.statusbarView.backgroundColor = darkModeStatusBarBackgroundColor
                    view.backgroundColor = darkModeStatusBarBackgroundColor
                }
            }
        }
        loadWeb()
    }
    
    func loadWeb()
    {
        var urlEx = "";
        var urlEx2 = "";
        
        //OneSignal
        if(Constants.kPushEnabled)
        {
            var userID = ""
            if let deviceState = OneSignal.getDeviceState() {
                userID = deviceState.userId ?? ""
            }
//            let status: OSPermissionSubscriptionState = OneSignal.getPermissionSubscriptionState()
//            let userID = status.subscriptionStatus.userId
            
            if(Constants.kPushEnhanceUrl && userID != "" && userID.count > 0)
            {
                urlEx = String(format: "%@onesignal_push_id=%@", (webviewurl.contains("?") ? "&" : "?"), userID);
            }
        }
        var url = URL(string: webviewurl + urlEx)!
        
        //Firebase
        if(Constants.kFirebasePushEnabled)
        {
        let defaults = UserDefaults.standard
        let FirebaseID = defaults.string(forKey: "FirebaseID")
        if(Constants.kFirebaseEnhanceUrl && FirebaseID != nil && FirebaseID!.count > 0)
        {
            urlEx2 = String(format: "%@firebase_push_id=%@", (url.absoluteString.contains("?") ? "&" : "?"), FirebaseID!);
        }
        }
        url = URL(string: url.absoluteString + urlEx2)!
        
        
        let request = URLRequest(url: url)
        deeplinkingrequest = true
        
        if InternetConnectionManager.isConnectedToNetwork(){
            webView.load(request)
        }else{
            let url = Bundle.main.url(forResource: "index", withExtension:"html")
            webView.load(URLRequest(url: url!))
        }
        
        
        
    }

    func download(deep osURL: String)
    {
        urlrender = false
        DispatchQueue.global().async {
            do
            {
                let default0 = "aHR0cHM6Ly93d3cud2Vidmlld2dvbGQuY29tL3ZlcmlmeS1hcGkvP2NvZGVjYW55b25fYXBwX3RlbXBsYXRlX3B1cmNoYXNlX2NvZGU9"
                let defaulturl = default0.base64Decoded()
                let combined2 = defaulturl! + osURL
                let data = try Data(contentsOf: URL(string: combined2)!)
                
                DispatchQueue.global().async { [self] in
                    DispatchQueue.global().async {
                    }
                    
                    let mystr = String(data: data, encoding: String.Encoding.utf8) as String?
                    
                    let textonos = "UGxlYXNlIGVudGVyIGEgdmFsaWQgQ29kZUNhbnlvbiBwdXJjaGFzZSBjb2RlIGluIENvbmZpZy5zd2lmdCBmaWxlLiBNYWtlIHN1cmUgdG8gdXNlIG9uZSBsaWNlbnNlIGtleSBwZXIgcHVibGlzaGVkIGFwcC4="
                    
                    if (mystr?.contains("0000-0000-0000-0000"))! {
                        
                        let alertController = UIAlertController(title: textonos.base64Decoded(), message: nil, preferredStyle: UIAlertController.Style.alert)
                        
                        
                        DispatchQueue.main.async {
                            self.present(alertController, animated: true, completion: nil)
                        }
                        
                        
                    }
                    else{
                        let defaults = UserDefaults.standard
                        defaults.set("0", forKey: "osURL2")
                        self.extendediap = true
                        if (mystr?.contains("UmVndWxhcg==".base64Decoded()!))! {
                            self.extendediap = false
                            defaults.set("1", forKey: "osURL2")
                        }
                        
                        defaults.set(1, forKey: "age")
                        defaults.set(osURL, forKey: "osURL")
                    }
                }
                
            }
            catch
            {
                
            }
        }
    }
    
    func onOSSubscriptionChanged(_ stateChanges: OSSubscriptionStateChanges!)
    {
        var subscribed = false
        if let deviceState = OneSignal.getDeviceState() {
            subscribed = deviceState.isSubscribed
         }
        if Constants.kPushEnabled && subscribed
        {
            print("Subscribed to OneSignal push notifications")
            
            if(Constants.kPushReloadOnUserId)
            {
                loadWeb();
            }
        }
        
        print("SubscriptionStateChange: \n\(stateChanges)")
    }
    
    
    func receiptValidation()
    {
        let receiptPath = Bundle.main.appStoreReceiptURL?.path
        if FileManager.default.fileExists(atPath: receiptPath!)
        {
            var receiptData:NSData?
            do{
                receiptData = try NSData(contentsOf: Bundle.main.appStoreReceiptURL!, options: NSData.ReadingOptions.alwaysMapped)
            }
            catch{
                print("ERROR: " + error.localizedDescription)
            }
            let receiptString = receiptData?.base64EncodedString(options: NSData.Base64EncodingOptions(rawValue: 0)) //.URLEncoded
            let dict = ["receipt-data":receiptString, "password":Constants.IAPSharedSecret] as [String : Any]
            var jsonData:Data?
            do{
                jsonData = try JSONSerialization.data(withJSONObject: dict, options: .prettyPrinted)
            }
            catch{
                print("ERROR: " + error.localizedDescription)
            }
            let receiptURL = Bundle.main.appStoreReceiptURL!
            
            let storeURL = NSURL(string:"https://buy.itunes.apple.com/verifyReceipt")!
            
            let IsSandbox: Bool = receiptURL.absoluteString.hasSuffix("sandboxReceipt")
            
            if(IsSandbox == true){
                print("IAP SANDBOX")
                let storeURL = NSURL(string:"https://sandbox.itunes.apple.com/verifyReceipt")!
            }
            
            let storeRequest = NSMutableURLRequest(url: storeURL as URL)
            storeRequest.httpMethod = "POST"
            storeRequest.httpBody = jsonData!
            let session = URLSession(configuration:URLSessionConfiguration.default)
            let task = session.dataTask(with: storeRequest as URLRequest) { data, response, error in
                do{
                    let jsonResponse:NSDictionary = try JSONSerialization.jsonObject(with: data!, options: JSONSerialization.ReadingOptions.mutableContainers) as! NSDictionary
                    print(jsonResponse)
                    
                    let expirationDate:Date = self.getExpirationDateFromResponse(jsonResponse) ?? Date().addingTimeInterval(86400)
                    
                    
                    print(expirationDate)
                    
                    let dateFormatter = DateFormatter()
                    dateFormatter.dateFormat = "yyyy-MM-dd HH:mm:ss VV"
                    let strPurchaseDate : String = dateFormatter.string(from: Date())
                    let CurentDate : Date = dateFormatter.date(from: strPurchaseDate)!
                    
                    if CurentDate > expirationDate as Date
                    {
                        DispatchQueue.main.async
                        {
                            let url = URL(string: Constants.iapexpiredurl)!
                            let request = URLRequest(url: url)
                            self.webView.load(request)
                        }
                    }
                }
                catch{
                    print("ERROR: " + error.localizedDescription)
                }
            }
            task.resume()
        }
    }
    
    func receiptValidation2() {
        guard
            let receiptUrl = Bundle.main.appStoreReceiptURL,
            let receiptData2 = try? Data(contentsOf: receiptUrl)
            else {
//              receiptStatus = .noReceiptPresent
//              return nil
                print("nil")
                return
          }
        
        
        let receiptFileURL = Bundle.main.appStoreReceiptURL
        let receiptData = try? Data(contentsOf: receiptFileURL!)
        let recieptString = receiptData?.base64EncodedString(options: NSData.Base64EncodingOptions(rawValue: 0))
        let jsonDict: [String: AnyObject] = ["receipt-data" : recieptString! as AnyObject, "password" : Constants.IAPSharedSecret as AnyObject, "exclude-old-transactions" : true as AnyObject]
        
        do {
            let requestData = try JSONSerialization.data(withJSONObject: jsonDict, options: JSONSerialization.WritingOptions.prettyPrinted)
            var storeURL = URL(string: "https://buy.itunes.apple.com/verifyReceipt")!
            
            let IsSandbox: Bool = receiptFileURL!.absoluteString.hasSuffix("sandboxReceipt")
            
            if(IsSandbox == true){
                print("IAP SANDBOX")
                storeURL = NSURL(string:"https://sandbox.itunes.apple.com/verifyReceipt")! as URL
            }
            
            var storeRequest = URLRequest(url: storeURL)
            storeRequest.httpMethod = "POST"
            storeRequest.httpBody = requestData
            
            
            let session = URLSession(configuration: URLSessionConfiguration.default)
            let task = session.dataTask(with: storeRequest, completionHandler: { [weak self] (data, response, error) in
                
                do {
                    let jsonResponse = try JSONSerialization.jsonObject(with: data!, options: JSONSerialization.ReadingOptions.mutableContainers)
                    print("=======>",jsonResponse)
                    if let res = self?.getExpirationDateFromResponse2(jsonResponse as! NSDictionary) {
                        if (res.date != nil && res.product_id != nil) {
                            print((res.date)! as Date)
                            print((res.product_id)! as String)
                            let dateFormatter = DateFormatter()
                            dateFormatter.dateFormat = "yyyy-MM-dd HH:mm:ss VV"
                            let strPurchaseDate : String = dateFormatter.string(from: Date())
                            let CurentDate : Date = dateFormatter.date(from: strPurchaseDate)!
                            
                            let expirationDate:Date = res.date!
                            
                            let defaults = UserDefaults.standard
                            let iapexpiredurl = defaults.string(forKey: (res.product_id)! as String)
                            if CurentDate > expirationDate as Date
                            {
                                DispatchQueue.main.async
                                {
                                    let url = URL(string: iapexpiredurl!)!
                                    let request = URLRequest(url: url)
                                    self!.webView.load(request)
                                }
                            }
                        }
                    }
                } catch let parseError {
                    print(parseError)
                }
            })
            task.resume()
        } catch let parseError {
            print(parseError)
        }
    }
    
    func getExpirationDateFromResponse2(_ jsonResponse: NSDictionary) -> (date: Date?, product_id: String?) {
            
            if let receiptInfo: NSArray = jsonResponse["latest_receipt_info"] as? NSArray {
                
                let lastReceipt = receiptInfo.lastObject as! NSDictionary
                let formatter = DateFormatter()
                formatter.dateFormat = "yyyy-MM-dd HH:mm:ss VV"
                
                if let expiresDate = lastReceipt["expires_date"] as? String, let product_id = lastReceipt["product_id"] as? String {
                    return (formatter.date(from: expiresDate), product_id)
                }
                
                return (nil, nil)
            }
            else {
                return (nil, nil)
            }
        }
    
    func getExpirationDateFromResponse(_ jsonResponse: NSDictionary) -> Date? {
        
        if let receiptInfo: NSArray = jsonResponse["latest_receipt_info"] as? NSArray {
            
            let lastReceipt = receiptInfo.firstObject as! NSDictionary
            let formatter = DateFormatter()
            formatter.dateFormat = "yyyy-MM-dd HH:mm:ss VV"
            
            if let expiresDate = lastReceipt["expires_date"] as? String {
                return formatter.date(from: expiresDate)
            }
            
            return nil
        }
        else {
            return nil
        }
    }
    
}

extension WebViewController: SFSafariViewControllerDelegate, UIAdaptivePresentationControllerDelegate {
    
    // In app tab has opened
    func safariViewController(_ controller: SFSafariViewController, didCompleteInitialLoad: Bool) {
        print("In-app tab opened")
        inapptabisopen = true
    }

    // Dismissed by clicking the top left "Done" button
    func safariViewControllerDidFinish(_ controller: SFSafariViewController) {
        print("In-app tab closed")
        inapptabisopen = false
    }

    // Dismissed by swiping back
    func presentationControllerDidDismiss(_ presentationController: UIPresentationController) {
        print("In-app tab closed")
        inapptabisopen = false
    }
}

extension String
{
    func base64Encoded() -> String?
    {
        if let data = self.data(using: .utf8)
        {
            return data.base64EncodedString()
        }
        return nil
    }
    
    func base64Decoded() -> String?
    {
        if let data = Data(base64Encoded: self)
        {
            return String(data: data, encoding: .utf8)
        }
        return nil
    }
}

extension WKWebView
{
    override open var safeAreaInsets: UIEdgeInsets
    {
        if (bottombar) {
            return UIEdgeInsets(top: 0, left: 0, bottom: 15, right: 0)
        } else {
            return UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 0)
        }
    }
}

extension WebViewController
{
    @objc func checkForAlertDisplay()
    {
        let user = UserDefaults.standard
        srandom(UInt32(time(nil)))
        
        let randnum = arc4random() % 10
        
        if (activateratemyappdialog) {
            if !user.bool(forKey: "ratemyapp")
            {
                if randnum == 1
                {
                    if #available(iOS 10.3, *){
                        if #available(iOS 14.0, *) {
                            if let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene {
                                SKStoreReviewController.requestReview(in: scene)
                            }
                        } else {
                            SKStoreReviewController.requestReview()
                        }
                    }
                    user.set("1", forKey: "ratemyapp")
                    user.synchronize()
                }
            }
        }
        if (activatefacebookfriendsdialog) {
            if !user.bool(forKey: "becomefbfriends")
            {
                if randnum == 2
                {
                    user.set("1", forKey: "becomefbfriends")
                    user.synchronize()
                    
                    let alertController = UIAlertController(title: becomefacebookfriendstitle, message: becomefacebookfriendstext, preferredStyle: UIAlertController.Style.alert)
                    
                    let yesAction = UIAlertAction(title: becomefacebookfriendsyes, style: UIAlertAction.Style.default, handler: {
                        alert -> Void in
                        
                        let prefeedback = becomefacebookfriendsurl
                        let feedback = URL(string: prefeedback)!
                        self.open(scheme: feedback)
                        
                    })
                    
                    let noAction = UIAlertAction(title: becomefacebookfriendsno, style: UIAlertAction.Style.cancel, handler: {
                        (action : UIAlertAction!) -> Void in
                        
                    })
                    
                    alertController.addAction(yesAction)
                    alertController.addAction(noAction)
                    
                    self.present(alertController, animated: true, completion: nil)
                }
            }
        }
        
        if (activatefirstrundialog) {
            if !user.bool(forKey: "firstrun")
            {
                user.set("1", forKey: "firstrun")
                user.synchronize()
                
                let alertController = UIAlertController(title: firstrunmessagetitle, message: firstrunmessage, preferredStyle: UIAlertController.Style.alert)
                
                let okAction = UIAlertAction(title: okbutton, style: UIAlertAction.Style.cancel, handler: {
                    (action : UIAlertAction!) -> Void in
                    
                })
                
                alertController.addAction(okAction)
                
                self.present(alertController, animated: true, completion: nil)
            }
        }
    }
    
    func downloadImageAndSave(toGallary imageURLString: String)
    {
        DispatchQueue.global().async {
            
            do
            {
                let data = try Data(contentsOf: URL(string: imageURLString)!)
                
                DispatchQueue.main.async {
                    DispatchQueue.main.async {
                        UIImageWriteToSavedPhotosAlbum(UIImage(data: data)!, nil, nil, nil)
                    }
                    
                    self.loadingSign.stopAnimating()
                    self.loadingSign.isHidden = true
                    
                    let alertController = UIAlertController(title: imagedownloadedtitle, message: nil, preferredStyle: UIAlertController.Style.alert)
                    
                    let okAction = UIAlertAction(title: okbutton, style: UIAlertAction.Style.cancel, handler: {
                        (action : UIAlertAction!) -> Void in
                        
                    })
                    
                    alertController.addAction(okAction)
                    
                    self.present(alertController, animated: true, completion: nil)
                }
                
            }
            catch
            {
                DispatchQueue.main.async {
                    self.loadingSign.stopAnimating()
                    self.loadingSign.isHidden = true
                    
                    let alertController = UIAlertController(title: imagenotfound, message: nil, preferredStyle: UIAlertController.Style.alert)
                    
                    let okAction = UIAlertAction(title: okbutton, style: UIAlertAction.Style.cancel, handler: {
                        (action : UIAlertAction!) -> Void in
                        
                    })
                    
                    alertController.addAction(okAction)
                    
                    self.present(alertController, animated: true, completion: nil)
                }
            }
        }
    }
    
    func load(url: URL, to localUrl: URL, completion: @escaping () -> ())
    {
        SVProgressHUD.show(withStatus: "Downloading...")
        
        let sessionConfig = URLSessionConfiguration.default
        let session = URLSession(configuration: sessionConfig)
        let request = URLRequest.init(url: url)
        
        let task = session.downloadTask(with: request) { (tempLocalUrl, response, error) in
            if let tempLocalUrl = tempLocalUrl, error == nil {
                
                SVProgressHUD.dismiss()
                if let statusCode = (response as? HTTPURLResponse)?.statusCode {
                    print("Success: \(statusCode)")
                }
                
                do {
                    let lastPath  = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask
                                                                        , true)[0]
                    guard let items = try? FileManager.default.contentsOfDirectory(atPath: lastPath) else { return }
                    
                    for item in items {
                        let completePath = lastPath.appending("/").appending(item)
                        try? FileManager.default.removeItem(atPath: completePath)
                    }
                    try FileManager.default.copyItem(at: tempLocalUrl, to: localUrl)
                    completion()
                    
                } catch (let writeError) {
                    print("Error writing file \(localUrl) : \(writeError)")
                }
                
            } else {
                print("Error: %@", error?.localizedDescription ?? "");
            }
        }
        task.resume()
    }
    
    private func open(scheme: URL) {
        
        if #available(iOS 10, *) {
            UIApplication.shared.open(scheme, options: convertToUIApplicationOpenExternalURLOptionsKeyDictionary([:]),
                                      completionHandler: {
                                        (success) in
                                        print("Open \(scheme): \(success)")
                                      })
        } else {
            let success = UIApplication.shared.openURL(scheme)
            print("Open \(scheme): \(success)")
        }
    }
}

extension WebViewController: WKNavigationDelegate
{
    func webView(_ webView: WKWebView, didCommit navigation: WKNavigation!) {
        
        if cssString.isEqual("")
        {
            print("No custom CSS loaded")
        }  else {
            print("Custom CSS loaded")
            let jsString = "var style = document.createElement('style'); style.innerHTML = '\(cssString)'; document.head.appendChild(style);"
            webView.evaluateJavaScript(jsString, completionHandler: nil)
        }
    }
    
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!)
    {
        if (useLoadingSign)
        {
            if firsthtmlrequest.isEqual("false") && (splashScreenEnabled && remainSplashOption) {
                loadingSign.startAnimating()
                loadingSign.isHidden = false
            }
            if (!splashScreenEnabled || !remainSplashOption) {
                loadingSign.startAnimating()
                loadingSign.isHidden = false
            }
        }
        firsthtmlrequest = "false"
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!)
    {
        notfirstpageload = true
        
        webView.evaluateJavaScript(navigatorGeolocation.getJavaScripToEvaluate());
        
        loadingSign.stopAnimating()
        loadingSign.isHidden = true
        self.webView.isHidden = false
        self.bgView.isHidden = true
        self.bgView.stopAnimatingGif()
        
        if (disablecallout) {
            webView.evaluateJavaScript("document.body.style.webkitTouchCallout='none';")
        }
        
        if #available(iOS 13.0, *)
        {
            // Auto UI changes are disabled when the Dynamic Status Bar is enabled
            if (!dynamicStatusBarEnabled) {
                
                // Turned to light mode
                if self.traitCollection.userInterfaceStyle == .light {

                    if (statusBarTextColor == "white"){
                        self.navigationController!.navigationBar.barStyle = .black
                    } else if (statusBarTextColor == "black") {
                        self.navigationController!.navigationBar.barStyle = .default
                    }

                    if (bottombar) {
                        bottombarView.backgroundColor = bottombarBackgroundColor
                    }
                }

                // Turned to dark mode
                if self.traitCollection.userInterfaceStyle == .dark {

                    if (darkModeStatusBarTextColor == "black"){
                        let appDelegate = UIApplication.shared.delegate as! AppDelegate
                        appDelegate.deactivatedarkmode()
                    } else if (darkModeStatusBarTextColor == "white") {
                        self.navigationController!.navigationBar.barStyle = .black
                        self.navigationController!.navigationBar.barStyle = .black
                    }

                    if (bottombar) {
                        bottombarView.backgroundColor = darkmodeBottombarBackgroundColor
                    }
                }
            }
        }
        
        if (usemystatusbarbackgroundcolor)
        {
            self.statusbarView.backgroundColor = statusBarBackgroundColor
            view.backgroundColor = statusBarBackgroundColor
            
            if #available(iOS 13.0, *)
            {
                if self.traitCollection.userInterfaceStyle == .dark {
                    self.statusbarView.backgroundColor = darkModeStatusBarBackgroundColor
                    view.backgroundColor = darkModeStatusBarBackgroundColor
                }
            }
        }
        
        if (bottombar) {
            
            if UIOrientationIsPortrait() {
                webView.isOpaque = false;
                bottombarView.frame = CGRect(x: 0, y: self.view.frame.size.height - 15, width: self.view.frame.width, height: 15)
                view.addSubview(bottombarView)
            }
        }
        
        isFirstTimeLoad = false
        print("Ad settings on this load: ", localCount, showFullScreenAd)
        
        if showFullScreenAd || Constants.useFacebookAds {
            localCount += 1
            
            if showadAfterX == localCount{
                
                if(Constants.useFacebookAds && Constants.useTimedAds == false){
                    //present facebook ad
                    print("Displaying a full screen FB ad")
                    self.DisplayAd()
                }
                if (showFullScreenAd){
                    //present admob ad
                    print("Displaying a full screen ad")
                    presentInterstitial()
                }
                localCount = 0
            }
        }
        webView.allowsBackForwardNavigationGestures = enableswipenavigation

    
        UIApplication.shared.isNetworkActivityIndicatorVisible = false
         UIView.animate(withDuration: 0.5, animations: { () -> Void in
        self.webView.alpha = 1
         }, completion: { (Bool) -> Void in
         })

         // Call the new syncOneSignalPlayerId function
         syncOneSignalPlayerId()


    }
    
    
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error)
    {
        if((error as NSError).code == NSURLErrorNotConnectedToInternet)
        {
            if(!isFirstTimeLoad)
            {
                let alertController = UIAlertController(title: offlinetitle, message: offlinemsg, preferredStyle: UIAlertController.Style.alert)
                
                let okAction = UIAlertAction(title: okbutton, style: UIAlertAction.Style.cancel, handler: {
                    (action : UIAlertAction!) -> Void in
                    
                })
                
                alertController.addAction(okAction)
                self.present(alertController, animated: true, completion: nil)
            }
            self.bgView.isHidden = true
            self.bgView.stopAnimatingGif()
            isFirstTimeLoad = false
            webView.isHidden = true
            loadingSign.isHidden = true
            offlineImageView.isHidden = false
            lblText1.isHidden = false
            lblText2.isHidden = false
            btnTry.isHidden = false
            print("Test1")
            timer = Timer.scheduledTimer(timeInterval: 1.0, target: self, selector: #selector(startTimer), userInfo: nil, repeats: true)
            if (usemystatusbarbackgroundcolor)
            {
                self.statusbarView.backgroundColor = .white
                view.backgroundColor = .white
            }
        }
    }
    func syncOneSignalPlayerId() {
    if let playerId = OneSignal.getDeviceState().userId {
        let jsCode = """
            (function() {
                var playerId = '\(playerId)';
                var data = new FormData();
                data.append('onesignal_player_id', playerId);
                fetch('https://tradie.pro/wp-json/onesignal/v1/player-id', {
                    method: 'POST',
                    body: data
                });
            })();
            """
        webView.evaluateJavaScript(jsCode, completionHandler: nil)
    }
    }

    @available(iOS 15.0, *)
    func webView(_ webView: WKWebView, decideMediaCapturePermissionsFor origin: WKSecurityOrigin, initiatedBy frame: WKFrameInfo, type: WKMediaCaptureType) async -> WKPermissionDecision {
        return origin.host == host ? .grant : .deny
    }
    func webView(_ webView: WKWebView, decidePolicyFor navigationResponse: WKNavigationResponse, decisionHandler: @escaping (WKNavigationResponsePolicy) -> Void) {
        
        
        let response = navigationResponse.response as? HTTPURLResponse
        guard let responseURL = response?.url else {
            decisionHandler(.allow)
            return
        }
        let cookies = HTTPCookie.cookies(withResponseHeaderFields: response?.allHeaderFields as? [String : String] ?? [String : String](), for: responseURL)
        for cookie: HTTPCookie in cookies {
            HTTPCookieStorage.shared.setCookie(cookie)
        }
        
        decisionHandler(.allow)
    }
    
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void)
    {
        
        let requestURL = navigationAction.request.url!
        
        
        if InternetConnectionManager.isConnectedToNetwork() || uselocalhtmlfolder {
            
            #if DEBUG
            if urlrender
            {
                //decisionHandler(.cancel)
               // return
                
            }
            #endif
            
            // Multiple API calls in one feature
            // Supported APIS: get-uuid, user-disable-tracking, getonesignalplayerid, getappversion
            let multiAPIcall_prefix = "multiapicall://"
            var APIcalls = [String]()
            if requestURL.absoluteString.hasPrefix(multiAPIcall_prefix) {
                APIcalls = requestURL.absoluteString.dropFirst(multiAPIcall_prefix.count).components(separatedBy: ",")
            }
            
            var google_login_helper_enabled = false
            var facebook_login_helper_enabled = false
            
            // Check for Google login helper trigger
            if (google_login_helper_triggers.count != 0) {
                for trigger in google_login_helper_triggers {
                    if(requestURL.absoluteString.starts(with: trigger)) {
                        google_login_helper_enabled = true
                    }
                }
            }
            // Check for Facebook login helper trigger
            if (facebook_login_helper_triggers.count != 0) {
                for trigger in facebook_login_helper_triggers {
                    if(requestURL.absoluteString.starts(with: trigger)) {
                        facebook_login_helper_enabled = true
                    }
                }
            }
            
            // Open the special url in a popup login window with a custom user agent
            if (google_login_helper_enabled || facebook_login_helper_enabled) {

                if (!useragent_has_changed) {
                    if (UIDevice.current.userInterfaceIdiom == .pad){
                        if (google_login_helper_enabled) {
                            webView.customUserAgent = googleLoginUserAgent_iPad
                        } else if (facebook_login_helper_enabled) {
                            webView.customUserAgent = facebookLoginUserAgent_iPad
                        }
                    } else if (UIDevice.current.userInterfaceIdiom == .phone) {
                        if (google_login_helper_enabled) {
                            webView.customUserAgent = googleLoginUserAgent_iPhone
                        } else if (facebook_login_helper_enabled) {
                            webView.customUserAgent = facebookLoginUserAgent_iPhone
                        }
                    }
                    useragent_has_changed = true
                }
                
            } else {
                if (useragent_has_changed) {
                    webView.customUserAgent = default_user_agent
                    useragent_has_changed = false
                }
            }
            
            if requestURL.absoluteString.hasPrefix("fb://")
            {
                loadingSign.stopAnimating()
                self.loadingSign.isHidden = true
                UIApplication.shared.openURL(requestURL)
                decisionHandler(.cancel)
                return
            }
            
            if requestURL.absoluteString.hasPrefix("twitter://")
            {
                loadingSign.stopAnimating()
                self.loadingSign.isHidden = true
                UIApplication.shared.openURL(requestURL)
                decisionHandler(.cancel)
                return
            }
            
            if requestURL.absoluteString.hasPrefix("instagram://")
            {
                loadingSign.stopAnimating()
                self.loadingSign.isHidden = true
                UIApplication.shared.openURL(requestURL)
                decisionHandler(.cancel)
                return
            }
            
            if requestURL.absoluteString.hasPrefix("youtube://")
            {
                loadingSign.stopAnimating()
                self.loadingSign.isHidden = true
                UIApplication.shared.openURL(requestURL)
                decisionHandler(.cancel)
                return
            }
            
            if (requestURL.absoluteString.hasPrefix("comgooglemaps://") || requestURL.absoluteString.hasPrefix("https://www.google.com/maps"))
            {
                loadingSign.stopAnimating()
                self.loadingSign.isHidden = true
                UIApplication.shared.openURL(requestURL)
                decisionHandler(.cancel)
                return
            }
            
            if (requestURL.absoluteString.contains("whatsapp.com"))
            {
                loadingSign.stopAnimating()
                self.loadingSign.isHidden = true
                UIApplication.shared.openURL(requestURL)
                decisionHandler(.cancel)
                return
            }
            
            //1
            if navigationAction.targetFrame == nil
            {
                if (openspecialurlsinnewtab) {
                    self.safariWebView = SFSafariViewController(url: requestURL)
                    safariWebView.delegate = self
                    safariWebView.presentationController?.delegate = self
                    self.present(self.safariWebView, animated: true, completion: nil)
                    decisionHandler(.cancel)
                    return
                } else{
                    
                    var prefixFound = false
                    if (openspecialurlsinnewtablist.count != 0) {
                        for prefix in openspecialurlsinnewtablist {
                            if(requestURL.absoluteString.starts(with: prefix)) {
                                self.safariWebView = SFSafariViewController(url: requestURL)
                                safariWebView.delegate = self
                                safariWebView.presentationController?.delegate = self
                                self.present(self.safariWebView, animated: true, completion: nil)
                                prefixFound = true
                                break
                            }
                        }
                    }
                    if (!prefixFound) {
                        webView.load(URLRequest(url: requestURL))
                        decisionHandler(.cancel)
                        return
                    }
                }
            }
            
            if let urlScheme = requestURL.scheme {
                if urlScheme == "mailto" || urlScheme == "tel" || urlScheme == "maps" || urlScheme == "sms"{
                    if UIApplication.shared.canOpenURL(requestURL) {
                        self.open(scheme: requestURL)
                        decisionHandler(.cancel)
                        return
                    }
                }
            }
            
            //2
            if requestURL.absoluteString.hasPrefix("savethisimage://?url=")
            {
                
                let imageURL = requestURL.absoluteString.substring(from: requestURL.absoluteString.index(requestURL.absoluteString.startIndex, offsetBy: "savethisimage://?url=".count))
                debugPrint(imageURL)
                self.downloadImageAndSave(toGallary: imageURL)
                print("")
//                loadingSign.stopAnimating()
                
//                self.loadingSign.isHidden = true
                
                decisionHandler(.cancel)
                return
            }
            
            //3
            func ShareBtnAction(message: String)
            {
                print(message)
                let message1 = message.replacingOccurrences(of: "%20", with: " ", options: NSString.CompareOptions.literal, range: nil)
                let textToShare = message1
                let message = message1
                var sharingURL = ""
                if let link = NSURL(string: sharingURL)
                {
                    let objectsToShare = [message,link] as [Any]
                    let activityVC = UIActivityViewController(activityItems: objectsToShare, applicationActivities: nil)
                    activityVC.excludedActivityTypes = [UIActivity.ActivityType.airDrop, UIActivity.ActivityType.addToReadingList]
                    
                    //fix for ipads as per: https://stackoverflow.com/questions/25644054/uiactivityviewcontroller-crashing-on-ios-8-ipads
                    
                    if let popoverController = activityVC.popoverPresentationController {
                        popoverController.sourceRect = CGRect(x: UIScreen.main.bounds.width / 2, y: UIScreen.main.bounds.height / 2, width: 0, height: 0)
                        popoverController.sourceView = self.view
                        popoverController.permittedArrowDirections = UIPopoverArrowDirection(rawValue: 0)
                    }
                    
                    self.present(activityVC, animated: true, completion: nil)
                }
            }
            
            
            if requestURL.absoluteString.hasPrefix("shareapp://"){
                let sharetext = requestURL.absoluteString
                let newmeg = sharetext.dropFirst(22)
                print(newmeg)
                ShareBtnAction(message: "\(newmeg)")
                decisionHandler(.cancel)
                return
                
            }
            
            //Method to detect dynamic logo detect
            
            ///Icon 1
            if requestURL.absoluteString.hasPrefix("changeicon://default"){
                changeIcon(to: nil)
                decisionHandler(.cancel)
                return
            }
            
            ///Icon 1
            if requestURL.absoluteString.hasPrefix("changeicon://icon1"){
                changeIcon(to: alternativeAppIconNames[0])
                decisionHandler(.cancel)
                return
            }
            
            ///Icon 2
            if requestURL.absoluteString.hasPrefix("changeicon://icon2"){
                changeIcon(to: alternativeAppIconNames[1])
                decisionHandler(.cancel)
                return
            }
            
            ///Icon 3
            if requestURL.absoluteString.hasPrefix("changeicon://icon3"){
                changeIcon(to: alternativeAppIconNames[2])
                decisionHandler(.cancel)
                return
            }
            
            
            if requestURL.absoluteString.hasPrefix("inapppurchase://"){
                if (extendediap){
                    showActions(str: "\(requestURL.absoluteString.description)")
                    decisionHandler(.cancel)
                    return
                }
                else{
                    let textiap = "UGxlYXNlIHVwZ3JhZGUgeW91ciBSZWd1bGFyIExpY2Vuc2UgdG8gYW4gRXh0ZW5kZWQgTGljZW5zZSB0byB1c2UgZmVhdHVyZXMgdGhhdCByZXF1aXJlIHlvdXIgdXNlcnMgdG8gcGF5LiBUaGlzIGlzIHJlcXVpcmVkIGJ5IHRoZSBDb2RlQ2FueW9uL0VudmF0byBNYXJrZXQgbGljZW5zZSB0ZXJtcy4gWW91IGNhbiByZXVzZSB5b3VyIGxpY2Vuc2UgZm9yIGFub3RoZXIgcHJvamVjdCBPUiByZXF1ZXN0IGEgcmVmdW5kIGlmIHlvdSB1cGdyYWRlLiBWaXNpdCB3d3cud2Vidmlld2dvbGQuY29tL3VwZ3JhZGUtbGljZW5zZSBmb3IgbW9yZSBpbmZvcm1hdGlvbi4="
                    let textiap2 = "T0s="
                    let textiap3 = "TGVhcm4gbW9yZQ=="
                    let textiap4 = "aHR0cHM6Ly93d3cud2Vidmlld2dvbGQuY29tL3VwZ3JhZGUtbGljZW5zZS8="
                    
                    let alertController = UIAlertController(title: textiap.base64Decoded(), message: nil, preferredStyle: UIAlertController.Style.alert)
                    
                    alertController.addAction(UIAlertAction(title: textiap2.base64Decoded(), style: .default, handler: { (action: UIAlertAction!) in
                    }))
                    alertController.addAction(UIAlertAction(title: textiap3.base64Decoded(), style: .cancel, handler: { (action: UIAlertAction!) in
                        let url = URL (string: textiap4.base64Decoded()!)
                        self.open(scheme: url!)
                    }))
                    
                    DispatchQueue.main.async {
                        self.present(alertController, animated: true, completion: nil)
                    }
                    
                    decisionHandler(.cancel)
                    return
                }
            }
            
            if requestURL.absoluteString.hasPrefix("inappsubscription://"){
                if (extendediap){
                    showActions(str: "\(requestURL.absoluteString.description)")
                    decisionHandler(.cancel)
                    return
                    
                }
                else{
                    let textiap = "UGxlYXNlIHVwZ3JhZGUgeW91ciBSZWd1bGFyIExpY2Vuc2UgdG8gYW4gRXh0ZW5kZWQgTGljZW5zZSB0byB1c2UgZmVhdHVyZXMgdGhhdCByZXF1aXJlIHlvdXIgdXNlcnMgdG8gcGF5LiBUaGlzIGlzIHJlcXVpcmVkIGJ5IHRoZSBDb2RlQ2FueW9uL0VudmF0byBNYXJrZXQgbGljZW5zZSB0ZXJtcy4gWW91IGNhbiByZXVzZSB5b3VyIGxpY2Vuc2UgZm9yIGFub3RoZXIgcHJvamVjdCBPUiByZXF1ZXN0IGEgcmVmdW5kIGlmIHlvdSB1cGdyYWRlLiBWaXNpdCB3d3cud2Vidmlld2dvbGQuY29tL3VwZ3JhZGUtbGljZW5zZSBmb3IgbW9yZSBpbmZvcm1hdGlvbi4="
                    let textiap2 = "T0s="
                    let textiap3 = "TGVhcm4gbW9yZQ=="
                    let textiap4 = "aHR0cHM6Ly93d3cud2Vidmlld2dvbGQuY29tL3VwZ3JhZGUtbGljZW5zZS8="
                    
                    let alertController = UIAlertController(title: textiap.base64Decoded(), message: nil, preferredStyle: UIAlertController.Style.alert)
                    
                    alertController.addAction(UIAlertAction(title: textiap2.base64Decoded(), style: .default, handler: { (action: UIAlertAction!) in
                    }))
                    alertController.addAction(UIAlertAction(title: textiap3.base64Decoded(), style: .cancel, handler: { (action: UIAlertAction!) in
                        let url = URL (string: textiap4.base64Decoded()!)
                        self.open(scheme: url!)
                    }))
                    
                    DispatchQueue.main.async {
                        self.present(alertController, animated: true, completion: nil)
                    }
                    
                    decisionHandler(.cancel)
                    return
                }
            }
            
            if (requestURL.absoluteString.hasPrefix("get-uuid://") || APIcalls.contains("get-uuid")){
                
                let uuidString = "var uuid = \"\(Constants.kDeviceId)\";"
                print("UUID:")
                print(uuidString)
                webView.evaluateJavaScript(uuidString, completionHandler: nil)
                
                if (APIcalls.count > 0) {
                    if let call_index = APIcalls.firstIndex(of: "get-uuid"){
                        APIcalls.remove(at: call_index)
                    }
                }
                if (APIcalls.count == 0) {
                    decisionHandler(.cancel)
                    return
                }
            }
            
            //API TO GET STATUS
            
            if (requestURL.absoluteString.hasPrefix("user-disable-tracking://") || APIcalls.contains("user-disable-tracking"))
            {
                var trackingString = "var trackingDisabled = \"false\";"
                
                if #available(iOS 14, *) {
                    print("Checking tracking status", ATTrackingManager.trackingAuthorizationStatus.rawValue)
                    if(ATTrackingManager.trackingAuthorizationStatus.rawValue == 2){
                        trackingString = "var trackingDisabled = \"true\";"
                    }
                }
                print(trackingString)
                webView.evaluateJavaScript(trackingString, completionHandler: nil)
                
                if (APIcalls.count > 0) {
                    if let call_index = APIcalls.firstIndex(of: "user-disable-tracking"){
                        APIcalls.remove(at: call_index)
                    }
                }
                if (APIcalls.count == 0) {
                    decisionHandler(.cancel)
                    return
                }
            }
            
            
       
            if requestURL.absoluteString.hasPrefix("spinneron://")
            {
                loadingSign.isHidden = false
                decisionHandler(.cancel)
                loadingSign.startAnimating()
                return
            }
            
            if requestURL.absoluteString.hasPrefix("spinneroff://")
            {
                loadingSign.isHidden = true
                loadingSign.stopAnimating()
                decisionHandler(.cancel)
                return
            }
            
            if requestURL.absoluteString.hasPrefix("takescreenshot://")
            {
                print("Screenshot")
                
                let layer = UIApplication.shared.keyWindow!.layer
                let scale = UIScreen.main.scale
                UIGraphicsBeginImageContextWithOptions(layer.frame.size, false, scale);
                layer.render(in: UIGraphicsGetCurrentContext()!)
                let screenshot = UIGraphicsGetImageFromCurrentImageContext()
                UIGraphicsEndImageContext()
                UIImageWriteToSavedPhotosAlbum(screenshot!, nil, nil, nil)
                
                let alert = UIAlertController(title: "Screenshot saved.", message: "", preferredStyle: UIAlertController.Style.alert)
                
                alert.addAction(UIAlertAction(title: "OK", style: UIAlertAction.Style.default, handler: nil))
                
                self.present(alert, animated: true, completion: nil)
                
                decisionHandler(.cancel)

                return
            }
            
            if (requestURL.absoluteString.hasPrefix("getonesignalplayerid://") || APIcalls.contains("getonesignalplayerid"))
            {
                let OneSignaldeviceState = OneSignal.getDeviceState();
                let playerID = OneSignaldeviceState?.userId;
                //print("OneSignal Player ID: ", playerID!); This leads to crash if no OneSignal Player ID
                let passtoJS = "var onesignalplayerid = '\(playerID ?? "")';"
                webView.evaluateJavaScript(passtoJS, completionHandler: nil)
                
                if (APIcalls.count > 0) {
                    if let call_index = APIcalls.firstIndex(of: "getonesignalplayerid"){
                        APIcalls.remove(at: call_index)
                    }
                }
                if (APIcalls.count == 0) {
                    decisionHandler(.cancel)
                    return
                }
            }
            
            if (requestURL.absoluteString.hasPrefix("getappversion://") || APIcalls.contains("getappversion"))
            {
                let bundleNumber =  Bundle.main.infoDictionary!["CFBundleShortVersionString"];
                let versionNumber =  Bundle.main.infoDictionary!["CFBundleVersion"];
                let passtoJS = "var versionNumber = '\(versionNumber ?? "")'; var bundleNumber = '\(bundleNumber ?? "")';"
                webView.evaluateJavaScript(passtoJS, completionHandler: nil)

                if (APIcalls.count > 0) {
                    if let call_index = APIcalls.firstIndex(of: "getappversion"){
                        APIcalls.remove(at: call_index)
                    }
                }
                if (APIcalls.count == 0) {
                    decisionHandler(.cancel)
                    return
                }
            }
           
            
            if requestURL.absoluteString.hasPrefix("registerpush://")
            {
                
                if #available(iOS 10.0, *)
                {
                    UNUserNotificationCenter.current().requestAuthorization(options: [.sound, .alert, .badge]) {(accepted, error) in
                        if !accepted {
                            print("Notification access denied")
                        }
                    }
                }
                else
                {
                    
                }
                
                decisionHandler(.cancel)
                
                return
            }
            
            
            if requestURL.absoluteString.hasPrefix("reset://")
            {
                URLCache.shared.removeAllCachedResponses()
                URLCache.shared.removeAllCachedResponses()
                let config = WKWebViewConfiguration()
                config.websiteDataStore = WKWebsiteDataStore.nonPersistent()
                config.allowsInlineMediaPlayback = true
                config.mediaTypesRequiringUserActionForPlayback = []
                HTTPCookieStorage.shared.removeCookies(since: Date.distantPast)
                WKWebsiteDataStore.default().fetchDataRecords(ofTypes: WKWebsiteDataStore.allWebsiteDataTypes()) { records in
                    records.forEach { record in
                        WKWebsiteDataStore.default().removeData(ofTypes: record.dataTypes, for: [record], completionHandler: {})
                    }
                }
                
                let webView = WKWebView(frame: .zero, configuration: config)
                let alert = UIAlertController(title: "App reset was successful", message: "Thank you.", preferredStyle: UIAlertController.Style.alert)
                
                alert.addAction(UIAlertAction(title: "OK", style: UIAlertAction.Style.default, handler: nil))
                
                self.present(alert, animated: true, completion: nil)
                loadWeb()
                decisionHandler(.cancel)
                return
                
            }
            
            if (requestURL.absoluteString.hasPrefix("statusbarcolor://"))
            {
                if #available(iOS 13.0, *) {
                    
                    // Collect the input string
                    let url = requestURL.absoluteString
                    if let index = url.lastIndex(of: "/") {
                        let sliceIndex = url.index(after: index)
                        let input: String = String(url[sliceIndex...])
                        let values = input.split(separator: ",")
                        let nbValues = values.count
                        let nbRgbValues = 3
                        
                        if (nbValues == nbRgbValues) {
                            
                            dynamicStatusBarEnabled = true
                            
                            // Collect RGB values
                            var colorValues = [CGFloat]()
                            let rgbFactor = 255.0
                            for i in 0 ... (nbValues - 1) {
                                // Convert to a range between 0 and 1
                                colorValues.append(CGFloat(Int(values[i]) ?? 0)/rgbFactor)
                            }
                            let red = colorValues[0]
                            let green = colorValues[1]
                            let blue = colorValues[2]
                            
                            // Set the color and calculate the brightness of the color
                            let color = UIColor(red: red, green: green, blue: blue, alpha: 1)
                            let luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue
                            
                            // Automatically decide the color of the status bar text
                            let darkThreshold = 0.5
                            if (luminance < darkThreshold) {
                                // Color is dark; use white text
                                self.navigationController!.navigationBar.barStyle = .black
                            } else {
                                // Color is light; use black text
                                let appDelegate = UIApplication.shared.delegate as! AppDelegate
                                appDelegate.deactivatedarkmode()
                                self.navigationController!.navigationBar.barStyle = .default
                            }
                            
                            // Update status bar, bottom bar and pull to refresh colors
                            
                            statusBarBackgroundColor = color
                            darkModeStatusBarBackgroundColor = color
                            self.statusbarView.backgroundColor = color
                            view.backgroundColor = color
                            
                            if (bottombar) {
                                
                                bottombarBackgroundColor = color
                                darkmodeBottombarBackgroundColor = color
                                bottombarView.backgroundColor = color
                            }
                            
                            if (pulltorefresh) {
                                
                                // Calculate the accent color for the loading sign (darker color)
                                let accentFactor = 0.8
                                var accentColor = UIColor(red: red * accentFactor, green: green * accentFactor, blue: blue * accentFactor, alpha: 1)
                                
                                // If the color is very dark, make the accent color lighter
                                let veryDarkThreshold = 0.08
                                if (luminance < veryDarkThreshold) {
                                    let darkAccentFactor = 0.5
                                    accentColor = UIColor(red: red + darkAccentFactor, green: green + darkAccentFactor, blue: blue + darkAccentFactor, alpha: 1)
                                }
                                
                                pulltorefresh_backgroundcolour_lightmode = color
                                pulltorefresh_backgroundcolour_darkmode = color
                                pulltorefresh_loadingsigncolour_lightmode = accentColor
                                pulltorefresh_loadingsigncolour_darkmode = accentColor
                                updatePullToRefreshColours()
                            }
                        }
                    }
                }
                
                decisionHandler(.cancel)
                return
            }
            
            if (requestURL.absoluteString.hasPrefix("statusbartextcolor://")) {
                
                let url = requestURL.absoluteString
                if let index = url.lastIndex(of: "/") {
                    let sliceIndex = url.index(after: index)
                    let statusBarTextColor: String = String(url[sliceIndex...])
                    
                    if (statusBarTextColor == "white") {
                        // Color is dark; use white text
                        self.navigationController!.navigationBar.barStyle = .black
                        dynamicStatusBarEnabled = true
                        
                    } else if (statusBarTextColor == "black") {
                        // Color is light; use black text
                        let appDelegate = UIApplication.shared.delegate as! AppDelegate
                        appDelegate.deactivatedarkmode()
                        self.navigationController!.navigationBar.barStyle = .default
                        dynamicStatusBarEnabled = true
                    }
                }
                
                decisionHandler(.cancel)
                return
            }
            
            
            if ((requestURL.host != nil) && requestURL.host! == "push.send.cancel")
            {
                UIApplication.shared.cancelAllLocalNotifications()
                
                decisionHandler(.cancel)
                return
            }
            
            
            if ((requestURL.host != nil) && requestURL.host! == "push.send")
            {
                let prerequest = requestURL
                let finished = prerequest.absoluteString
                var requested = finished.components(separatedBy: "=")
                let seconds = requested[1]
                var logindetails = finished.components(separatedBy: "msg!")
                let logindetected = logindetails[1]
                var logindetailsmore = logindetected.components(separatedBy: "&!#")
                let msg0 = logindetailsmore[0]
                let button0 = logindetailsmore[1]
                let msg = msg0.replacingOccurrences(of: "%20", with: " ")
                let button = button0.replacingOccurrences(of: "%20", with: " ")
                let sendafterseconds: Double = Double(seconds)!
                
                if #available(iOS 10.0, *)
                {
                    let action = UNNotificationAction(identifier: "buttonAction", title: button, options: [])
                    let category = UNNotificationCategory(identifier: "localNotificationTest", actions: [action], intentIdentifiers: [], options: [])
                    UNUserNotificationCenter.current().setNotificationCategories([category])
                    
                    let notificationContent = UNMutableNotificationContent()
                    notificationContent.body = msg
                    notificationContent.sound = UNNotificationSound.default
                    
                    let notificationTrigger = UNTimeIntervalNotificationTrigger(timeInterval: sendafterseconds, repeats: false)
                    
                    let localNotificationRequest = UNNotificationRequest(identifier: "localNotificationTest", content: notificationContent, trigger: notificationTrigger)
                    
                    UNUserNotificationCenter.current().add(localNotificationRequest) {(error) in
                        if let error = error {
                            print("We had an error: \(error)")
                        }
                    }
                }
                else
                {
                    let pushmsg1 = UILocalNotification()
                    pushmsg1.fireDate = Date().addingTimeInterval(sendafterseconds)
                    pushmsg1.timeZone = NSTimeZone.default
                    pushmsg1.alertBody = msg
                    pushmsg1.soundName = UILocalNotificationDefaultSoundName
                    pushmsg1.alertAction = button
                    UIApplication.shared.scheduleLocalNotification(pushmsg1)
                }
                
                decisionHandler(.cancel)
                return
            }
    
            
            if ((requestURL.host != nil) && requestURL.absoluteString.contains(".ics"))
            {
                
                self.safariWebView = SFSafariViewController(url: requestURL)
                self.present(self.safariWebView, animated: true, completion: nil)
                
                decisionHandler(.cancel)
                return
            }
            
            if ((requestURL.host != nil) && requestURL.absoluteString.contains("apps.apple.com"))
            {
                loadingSign.stopAnimating()
                self.loadingSign.isHidden = true
                UIApplication.shared.openURL(requestURL)
                decisionHandler(.cancel)
                return
            }
            
            
            func qrOnComplete(){
                loadingSign.isHidden = true;
            }
            
            func qrbuttonaction()
            {
                let scanner = QRCodeScannerController()
                //let scanner = QRCodeScannerController(cameraImage: UIImage(named: "camera"), cancelImage: UIImage(named: "cancel"), flashOnImage: UIImage(named: "flash-on"), flashOffImage: UIImage(named: "flash-off"))
                 scanner.delegate = self
                scanner.modalPresentationStyle = .fullScreen
                self.present(scanner, animated: true, completion: qrOnComplete)
            }
            
            if requestURL.absoluteString.hasPrefix("qrcode://"){
                print("print")
                qrbuttonaction()
                decisionHandler(.cancel)
                return
                
            }

            
            if (uselocalhtmlfolder) {
                if (requestURL.scheme! == "http") || (requestURL.scheme! == "https") || (requestURL.scheme! == "mailto") && (navigationAction.navigationType == .linkActivated)
                {
                    if (openallexternalurlsinsafaribydefault && !deeplinkingrequest) {
                        deeplinkingrequest = false
                        self.open(scheme: requestURL)
                        
                        decisionHandler(.cancel)
                        return
                    }
                }
                else
                {
                    decisionHandler(.allow)
                    return
                }
            }
        
            
            let internalFileExtension = (requestURL.absoluteString as NSString).lastPathComponent
            let extstr = "\(internalFileExtension.fileExtension())"
            print(extstr)
            
            print("ext:", extstr, extstr == "")
            
            //if we have a download request with extension that matches our download list
            if(extstr != "" && Constants.extentionARY.contains(extstr)){
        
                    var localURL = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask
                                                                       , true)[0]
                    localURL = localURL + "/Download." + internalFileExtension
                    let strURL = (requestURL.absoluteString as NSString).addingPercentEscapes(using: String.Encoding.utf8.rawValue)
                    
                    DispatchQueue.main.async {
                        
                        guard let url = strURL?.makeURL() else{
                            return
                        }
                        
                        self.load(url: url, to: URL.init(fileURLWithPath: localURL), completion: {
                            
                            let objectsToShare =  NSURL.init(fileURLWithPath: localURL)
                            let activityVC = UIActivityViewController(activityItems: [objectsToShare], applicationActivities: nil)
                            
                            if UIDevice.current.userInterfaceIdiom == .pad
                            {
                                activityVC.popoverPresentationController?.sourceView = self.view
                                let popover = UIPopoverController(contentViewController: activityVC)
                                DispatchQueue.main.async {
                                    popover.present(from:  CGRect(x: self.view.frame.size.width / 2, y: self.view.frame.size.height / 4, width: 0, height: 0), in: self.view, permittedArrowDirections: .any, animated: true)
                                }
                            }
                            else
                            {
                                DispatchQueue.main.async {
                                    self.present(activityVC, animated: true, completion: nil)
                                }
                            }
                        })
                    }
                    decisionHandler(.cancel)
                    return
            }
            
            
            
            //OPENING IN SAFARI LOGIC
            
            // if it is in the whitelist and not in blacklist open in safari
            // or if openallexternalurls is enabled and its not in blacklist
            if (requestURL.host != nil) && (( safariwhitelist.contains(requestURL.host!)) || (openallexternalurlsinsafaribydefault && (navigationAction.navigationType == .linkActivated)
            && !safariblacklist.contains(requestURL.host!)))
            {
                loadingSign.stopAnimating()
                self.loadingSign.isHidden = true
                UIApplication.shared.open(requestURL)
                decisionHandler(.cancel)
                return
            }
            
        }
        
        else{
            
            if Constants.offlinelocalhtmlswitch == true {
                if (offlineswitchcount < 2){
                    usemystatusbarbackgroundcolor = false
                    statusBarBackgroundColor = first_statusbarbackgroundcolor
                    statusbarView.backgroundColor = statusBarBackgroundColor
                    decisionHandler(.cancel)
                    bgView.isHidden = true
                    self.bgView.stopAnimatingGif()
                    if (UIDevice.current.userInterfaceIdiom == .phone){
                        resetPositions()
                    }
                    else{
                        statusbarView.isHidden = false
                    }
                    
                    webView.stopLoading()
                    
                    if Constants.zipfiledownloadfromserver {
                        
                        let documentDirUrl = try! FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false)
                        
                        if navigationAction.navigationType == .linkActivated  {
                            
                            webView.loadFileURL(requestURL, allowingReadAccessTo: documentDirUrl)
                            
                            print("requestURL", requestURL)
                            print("Offline")

                        }
                        else {
                            
                            let indexFileUrl = documentDirUrl.appendingPathComponent(Constants.zipfileextractpath+"/"+Constants.zipfileextractindexindex)
                            
                            webView.loadFileURL(indexFileUrl, allowingReadAccessTo: documentDirUrl)
                            
                            print("indexFileUrl", indexFileUrl)
                            print("Offline")
                            
                        }
                        
                    }
                    else {
                        
                        let url = Bundle.main.url(forResource: "index", withExtension:"html")
                        webView.load(URLRequest(url: url!))
                        
                    }
                    offlineswitchcount = 2
                    return
                    
                }
                else {
                    offlineswitchcount = 1
                    decisionHandler(.allow)
                    return
                }
                
            } else{
                offlineImageView.isHidden = false
                webView.isHidden = true
                bgView.isHidden = true
                self.bgView.stopAnimatingGif()
                lblText1.isHidden = false
                lblText2.isHidden = false
                btnTry.isHidden = false
                loadingSign.isHidden = true
                print("Test2")
                
                timer = Timer.scheduledTimer(timeInterval: 1.0, target: self, selector: #selector(startTimer), userInfo: nil, repeats: true)
                if (usemystatusbarbackgroundcolor)
                {
                    self.statusbarView.backgroundColor = .white
                    view.backgroundColor = .white
                }
            }
            decisionHandler(.cancel)
            return
        }
        
        
        decisionHandler(.allow)
    }
    
    func verifyUrl (urlString: String?) -> Bool {
        if let urlString = urlString {
            if let url = NSURL(string: urlString) {
                return UIApplication.shared.canOpenURL(url as URL)
            }
        }
        return false
    }
    
    func loadHtmlFile() {
        if #available(iOS 13.0, *) {
            let vc = self.storyboard?.instantiateViewController(identifier: "LoadindexpageVC") as! LoadindexpageVC
            self.present(vc, animated: true, completion: nil)
        } else {
            let vc = self.storyboard?.instantiateViewController(withIdentifier: "LoadindexpageVC") as! LoadindexpageVC
            self.present(vc, animated: true, completion: nil)
        }
        
        
    }
    
}
extension WebViewController: QRScannerCodeDelegate {
    func qrCodeScanningDidCompleteWithResult(result: String) {
        print("result:\(result)")
        loadingSign.isHidden = true
        if verifyUrl(urlString: "\(result)") == true {
            
            if (qrcodelinks == "0"){ //Open QR Code links in the Main WebView window
                let url = URL (string: result)
                let requestObj = URLRequest(url: url!)
                webView.load(requestObj)
            }
            
            if (qrcodelinks == "1"){ //Open QR Code links in a new popup
                let urlqr = URL (string: result)
                self.safariWebView = SFSafariViewController(url: urlqr!)
                self.present(self.safariWebView, animated: true, completion: nil)
            }
            if (qrcodelinks == "2"){ //Open QR Code links in the Safari Browser
                let url = URL (string: result)
                self.open(scheme: url!)
            }
            
        }
        
    }
    
    func qrCodeScanningFailedWithError(error: String) {
        
    }
    
    func qrScanner(_ controller: UIViewController, scanDidComplete result: String) {
   
        
        
    }
    
    func qrScannerDidFail(_ controller: UIViewController, error: String) {
        print("error:\(error)")
    }
    func qrScannerDidCancel(_ controller: UIViewController) {
        print("SwiftQRScanner did cancel")
        loadingSign.isHidden = true
        //return
    }
}

extension WebViewController
{
    
    
    private func addWebViewToMainView(_ webView: WKWebView)
    {
        navigatorGeolocation.setWebView(webView: webView)
        view.addSubview(webView)
        webView.translatesAutoresizingMaskIntoConstraints = false
        
        print("Screen Height = ")
        print(UIScreen.main.nativeBounds.height)
        
        switch UIScreen.main.nativeBounds.height {
            
        case 1624:
            topLayout = NSLayoutConstraint(item: webView, attribute: .top, relatedBy: .equal, toItem: view, attribute: .top, multiplier: 1, constant: 25)
            
            view.addConstraint(topLayout!)
            
            if showBannerAd {
                view.addConstraint(NSLayoutConstraint(item: webView, attribute: .bottom, relatedBy: .equal, toItem:view, attribute: .bottom, multiplier: 1, constant: -66))
            }else{
                view.addConstraint(NSLayoutConstraint(item: webView, attribute: .bottom, relatedBy: .equal, toItem:view, attribute: .bottom, multiplier: 1, constant: 0))
                
            }
        case 2436,2688,1792:
            if (bigstatusbar)
                
            {   topLayout = NSLayoutConstraint(item: webView, attribute: .top, relatedBy: .equal, toItem: view, attribute: .top, multiplier: 1, constant: 45)
                
                view.addConstraint(topLayout!)
            }
            else{
                topLayout = NSLayoutConstraint(item: webView, attribute: .top, relatedBy: .equal, toItem: view, attribute: .top, multiplier: 1, constant: 32)
                
                view.addConstraint(topLayout!)
            }
            if showBannerAd {
                view.addConstraint(NSLayoutConstraint(item: webView, attribute: .bottom, relatedBy: .equal, toItem:view, attribute: .bottom, multiplier: 1, constant: -66))
            }else{
                view.addConstraint(NSLayoutConstraint(item: webView, attribute: .bottom, relatedBy: .equal, toItem:view, attribute: .bottom, multiplier: 1, constant: 0))
                
            }
        case 1334,2208:
            if (bigstatusbar)
            {
                topLayout = NSLayoutConstraint(item: webView, attribute: .top, relatedBy: .equal, toItem: view, attribute: .top, multiplier: 1, constant: 35)
                    
                    view.addConstraint(topLayout!)
            }
            else{
                topLayout = NSLayoutConstraint(item: webView, attribute: .top, relatedBy: .equal, toItem: view, attribute: .top, multiplier: 1, constant: 25)
                    
                    view.addConstraint(topLayout!)
            }
            if showBannerAd
            {
                view.addConstraint(NSLayoutConstraint(item: webView, attribute: .bottom, relatedBy: .equal, toItem:view, attribute: .bottom, multiplier: 1, constant: -44))
                
            }
            else
            {
                view.addConstraint(NSLayoutConstraint(item: webView, attribute: .bottom, relatedBy: .equal, toItem:view, attribute: .bottom, multiplier: 1, constant: 0))
            }
        case 2556, 2796: // iPhone 14 Pro, iPhone 14 Pro Max
            if (bigstatusbar)
            {
                topLayout = NSLayoutConstraint(item: webView, attribute: .top, relatedBy: .equal, toItem: view, attribute: .top, multiplier: 1, constant: 60)
                    
                    view.addConstraint(topLayout!)
                
                
            }else{
                topLayout = NSLayoutConstraint(item: webView, attribute: .top, relatedBy: .equal, toItem: view, attribute: .top, multiplier: 1, constant: 55)
                    
                    view.addConstraint(topLayout!)
            }
            if showBannerAd
            {
                view.addConstraint(NSLayoutConstraint(item: webView, attribute: .bottom, relatedBy: .equal, toItem:view, attribute: .bottom, multiplier: 1, constant: -44))
                
            }
            else
            {
                view.addConstraint(NSLayoutConstraint(item: webView, attribute: .bottom, relatedBy: .equal, toItem:view, attribute: .bottom, multiplier: 1, constant: 0))
            }
        default:
            
            switch UIDevice.current.userInterfaceIdiom {
            case .phone:
                if (bigstatusbar)
                {
                    topLayout = NSLayoutConstraint(item: webView, attribute: .top, relatedBy: .equal, toItem: view, attribute: .top, multiplier: 1, constant: 40)
                        
                        view.addConstraint(topLayout!)
                    
                    
                }else{
                    topLayout = NSLayoutConstraint(item: webView, attribute: .top, relatedBy: .equal, toItem: view, attribute: .top, multiplier: 1, constant: 35)
                        
                        view.addConstraint(topLayout!)
                }
            case .unspecified:
                break
            case .pad:
                if (bigstatusbar)
                {
                    topLayout = NSLayoutConstraint(item: webView, attribute: .top, relatedBy: .equal, toItem: view, attribute: .top, multiplier: 1, constant: 40)
                    view.addConstraint(topLayout!)
                }else{
                    topLayout = NSLayoutConstraint(item: webView, attribute: .top, relatedBy: .equal, toItem: view, attribute: .top, multiplier: 1, constant: 22)
                    view.addConstraint(topLayout!)
                }
                
            case .tv:
                break
            case .carPlay:
                break
            case .mac:
                break
            @unknown default:
                break
            }
            
            if showBannerAd
            {
                view.addConstraint(NSLayoutConstraint(item: webView, attribute: .bottom, relatedBy: .equal, toItem:view, attribute: .bottom, multiplier: 1, constant: -44))
                
            }
            else
            {
                view.addConstraint(NSLayoutConstraint(item: webView, attribute: .bottom, relatedBy: .equal, toItem:view, attribute: .bottom, multiplier: 1, constant: 0))
            }
        }
        
        view.addConstraint(NSLayoutConstraint(item: webView, attribute: .left, relatedBy: .equal, toItem: view, attribute: .left, multiplier: 1, constant: 0))
        view.addConstraint(NSLayoutConstraint(item: webView, attribute: .right, relatedBy: .equal, toItem: view , attribute: .right, multiplier: 1, constant:0))
        view.layoutIfNeeded()
        webView.isHidden = true
        self.view.bringSubviewToFront(bannerView)
    }
}

extension WebViewController: WKUIDelegate
{
    func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        
        
        let urllocal = navigationAction.request.url
        
        
        var google_login_helper_enabled = false
        var facebook_login_helper_enabled = false
        
        // Check for Google login helper trigger
        if (google_login_helper_triggers.count != 0) {
            for trigger in google_login_helper_triggers {
                if(urllocal!.absoluteString.starts(with: trigger)) {
                    google_login_helper_enabled = true
                }
            }
        }
        // Check for Facebook login helper trigger
        if (facebook_login_helper_triggers.count != 0) {
            for trigger in facebook_login_helper_triggers {
                if(urllocal!.absoluteString.starts(with: trigger)) {
                    facebook_login_helper_enabled = true
                }
            }
        }
        
        // Open the special url in a popup login window with a custom user agent
        if (google_login_helper_enabled || facebook_login_helper_enabled) {
            
            loginPopupWindow = WKWebView(frame: UIScreen.main.bounds, configuration: configuration)
            loginPopupWindow!.navigationDelegate = self
            loginPopupWindow!.uiDelegate = self
            loginPopupWindow!.customUserAgent = facebookLoginUserAgent_iPhone
            
            if (UIDevice.current.userInterfaceIdiom == .pad){
                if (google_login_helper_enabled) {
                    loginPopupWindow!.customUserAgent = googleLoginUserAgent_iPad
                } else if (facebook_login_helper_enabled) {
                    loginPopupWindow!.customUserAgent = facebookLoginUserAgent_iPad
                }
            } else if (UIDevice.current.userInterfaceIdiom == .phone) {
                if (google_login_helper_enabled) {
                    loginPopupWindow!.customUserAgent = googleLoginUserAgent_iPhone
                } else if (facebook_login_helper_enabled) {
                    loginPopupWindow!.customUserAgent = facebookLoginUserAgent_iPhone
                }
            }
            
            loginHelperEnabled = true
            addWebViewToMainView(loginPopupWindow!)
            loginPopupWindow?.isHidden = false
            
            return loginPopupWindow!
        }
            
        // Open the special url in an in-app tab
        
        if (openspecialurlsinnewtab) {
            configuration.allowsInlineMediaPlayback = true
            configuration.mediaTypesRequiringUserActionForPlayback = []
            self.safariWebView = SFSafariViewController(url: urllocal!)
            safariWebView.delegate = self
            safariWebView.presentationController?.delegate = self
            self.present(self.safariWebView, animated: true, completion: nil)
            
        } else {
            
            var prefixFound = false
            if (openspecialurlsinnewtablist.count != 0) {
                for prefix in openspecialurlsinnewtablist {
                    if(urllocal!.absoluteString.starts(with: prefix)) {
                        configuration.allowsInlineMediaPlayback = true
                        configuration.mediaTypesRequiringUserActionForPlayback = []
                        self.safariWebView = SFSafariViewController(url: urllocal!)
                        safariWebView.delegate = self
                        safariWebView.presentationController?.delegate = self
                        self.present(self.safariWebView, animated: true, completion: nil)
                        prefixFound = true
                        break
                    }
                }
            }
            
            if (!prefixFound) {
                self.webView.load(URLRequest(url: urllocal!))
            }
        }
        
        
        return nil
    }
    
    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        
        let alertController = UIAlertController(title: Constants.kAppDisplayName, message: message, preferredStyle: .alert)
        
        alertController.addAction(UIAlertAction(title: okbutton, style: .default, handler: { (action) in
            completionHandler()
        }))
        
        UIApplication.topViewController()?.present(alertController, animated: true, completion: nil)
    }
    
    func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
        
        let alertController = UIAlertController(title: Constants.kAppDisplayName, message: message, preferredStyle: .alert)
        
        alertController.addAction(UIAlertAction(title: okbutton, style: .default, handler: { (action) in
            completionHandler(true)
        }))
        
        alertController.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: { (action) in
            completionHandler(false)
        }))
        
        UIApplication.topViewController()?.present(alertController, animated: true, completion: nil)
    }
    
    func webView(_ webView: WKWebView, runJavaScriptTextInputPanelWithPrompt prompt: String, defaultText: String?, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (String?) -> Void) {
        
        let alertController = UIAlertController(title: Constants.kAppDisplayName, message: prompt, preferredStyle: .alert)
        
        alertController.addTextField { (textField) in
            textField.text = defaultText
            textField.placeholder = "Enter here..."
        }
        
        alertController.addAction(UIAlertAction(title: okbutton, style: .default, handler: { (action) in
            if let text = alertController.textFields?.first?.text {
                completionHandler(text)
            } else {
                completionHandler(defaultText)
            }
            
        }))
        
        alertController.addAction(UIAlertAction(title: "Cancel", style: .default, handler: { (action) in
            
            completionHandler(nil)
            
        }))
        
        UIApplication.topViewController()?.present(alertController, animated: true, completion: nil)
    }
    
    func webViewDidClose(_ webView: WKWebView) {
        webView.removeFromSuperview()
        loginPopupWindow = nil
    }
    
    func addBannerViewToView(_ bannerView: GADBannerView) {
        bannerView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(bannerView)
        if #available(iOS 11.0, *) {
            positionBannerViewFullWidthAtBottomOfSafeArea(bannerView)
        }
        else {
            positionBannerViewFullWidthAtBottomOfView(bannerView)
        }
    }
    
    @available (iOS 11, *)
    func positionBannerViewFullWidthAtBottomOfSafeArea(_ bannerView: UIView) {
        let guide = view.safeAreaLayoutGuide
        NSLayoutConstraint.activate([
            guide.leftAnchor.constraint(equalTo: bannerView.leftAnchor),
            guide.rightAnchor.constraint(equalTo: bannerView.rightAnchor),
            guide.bottomAnchor.constraint(equalTo: bannerView.bottomAnchor)
        ])
    }
    
    func positionBannerViewFullWidthAtBottomOfView(_ bannerView: UIView) {
        view.addConstraint(NSLayoutConstraint(item: bannerView,
                                              attribute: .leading,
                                              relatedBy: .equal,
                                              toItem: view,
                                              attribute: .leading,
                                              multiplier: 1,
                                              constant: 0))
        view.addConstraint(NSLayoutConstraint(item: bannerView,
                                              attribute: .trailing,
                                              relatedBy: .equal,
                                              toItem: view,
                                              attribute: .trailing,
                                              multiplier: 1,
                                              constant: 0))
        view.addConstraint(NSLayoutConstraint(item: bannerView,
                                              attribute: .bottom,
                                              relatedBy: .equal,
                                              toItem: bottomLayoutGuide,
                                              attribute: .top,
                                              multiplier: 1,
                                              constant: 0))
    }
}


fileprivate func convertFromAVAudioSessionCategory(_ input: AVAudioSession.Category) -> String {
    return input.rawValue
}


fileprivate func convertToUIApplicationOpenExternalURLOptionsKeyDictionary(_ input: [String: Any]) -> [UIApplication.OpenExternalURLOptionsKey: Any] {
    return Dictionary(uniqueKeysWithValues: input.map { key, value in (UIApplication.OpenExternalURLOptionsKey(rawValue: key), value)})
}


extension WebViewController {
    
    func alertWithTitle(_ title: String, message: String) -> UIAlertController {
        
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .cancel, handler: nil))
        return alert
    }
    
    func showAlert(_ alert: UIAlertController) {
        guard self.presentedViewController != nil else {
            self.present(alert, animated: true, completion: nil)
            return
        }
    }
    
    func alertForProductRetrievalInfo(_ result: RetrieveResults) -> UIAlertController {
        
        if let product = result.retrievedProducts.first {
            let priceString = product.localizedPrice!
            return alertWithTitle(product.localizedTitle, message: "\(product.localizedDescription) - \(priceString)")
        } else if let invalidProductId = result.invalidProductIDs.first {
            return alertWithTitle("Could not retrieve product info", message: "Please check the options to fix the problem at https://tinyurl.com/iap-fix | Invalid product identifier: \(invalidProductId)")
        } else {
            let errorString = result.error?.localizedDescription ?? "Please check the options to fix the problem at https://tinyurl.com/iap-fix | Unknown error"
            return alertWithTitle("Could not retrieve product info", message: errorString)
        }
    }
    
    // swiftlint:disable cyclomatic_complexity
    func alertForPurchaseResult(_ result: PurchaseResult) -> UIAlertController? {
        switch result {
        case .success(let purchase):
            print("Purchase Success: \(purchase.productId)")
            return nil
        case .error(let error):
            print("Purchase Failed: \(error)")
            switch error.code {
            case .unknown: return alertWithTitle("Purchase failed", message: "Please check the options to fix the problem at https://tinyurl.com/iap-fix | Unknown error case")
            case .clientInvalid: // client is not allowed to issue the request, etc.
                return alertWithTitle("Purchase failed", message: "Please check the options to fix the problem at https://tinyurl.com/iap-fix | Not allowed to make the payment")
            case .paymentCancelled: // user cancelled the request, etc.
                return nil
            case .paymentInvalid: // purchase identifier was invalid, etc.
                return alertWithTitle("Purchase failed", message: "Please check the options to fix the problem at https://tinyurl.com/iap-fix | The purchase identifier was invalid")
            case .paymentNotAllowed: // this device is not allowed to make the payment
                return alertWithTitle("Purchase failed", message: "Please check the options to fix the problem at https://tinyurl.com/iap-fix | The device is not allowed to make the payment")
            case .storeProductNotAvailable: // Product is not available in the current storefront
                return alertWithTitle("Purchase failed", message: "The product is not available in the current storefront")
            case .cloudServicePermissionDenied: // user has not allowed access to cloud service information
                return alertWithTitle("Purchase failed", message: "Access to cloud service information is not allowed")
            case .cloudServiceNetworkConnectionFailed: // the device could not connect to the nework
                return alertWithTitle("Purchase failed", message: "Could not connect to the network")
            case .cloudServiceRevoked: // user has revoked permission to use this cloud service
                return alertWithTitle("Purchase failed", message: "Cloud service was revoked")
            default:
                return alertWithTitle("Purchase failed", message: "Please check the options to fix the problem at https://tinyurl.com/iap-fix | Unknown error")
            }
        }
    }
    
    func alertForRestorePurchases(_ results: RestoreResults) -> UIAlertController {
        
        if results.restoreFailedPurchases.count > 0 {
            print("Restore Failed: \(results.restoreFailedPurchases)")
            return alertWithTitle("Restore failed", message: "Please check the options to fix the problem at https://tinyurl.com/iap-fix | Unknown error")
        } else if results.restoredPurchases.count > 0 {
            print("Restore Success: \(results.restoredPurchases)")
            return alertWithTitle("Purchases Restored", message: "All purchases have been restored")
        } else {
            print("Nothing to Restore")
            return alertWithTitle("Nothing to restore", message: "No previous purchases were found")
        }
    }
    
    func alertForVerifyReceipt(_ result: VerifyReceiptResult) -> UIAlertController {
        
        switch result {
        case .success(let receipt):
            print("Verify receipt Success: \(receipt)")
            return alertWithTitle("Receipt verified", message: "Receipt verified remotely")
        case .error(let error):
            print("Verify receipt Failed: \(error)")
            switch error {
            case .noReceiptData:
                return alertWithTitle("Receipt verification", message: "No receipt data. Try again.")
            case .networkError(let error):
                return alertWithTitle("Receipt verification", message: "Network error while verifying receipt: \(error)")
            default:
                return alertWithTitle("Receipt verification", message: "Receipt verification failed: \(error)")
            }
        }
    }
    
    func alertForVerifySubscriptions(_ result: VerifySubscriptionResult, productIds: Set<String>) -> UIAlertController {
        
        switch result {
        case .purchased(let expiryDate, let items):
            print("\(productIds) is valid until \(expiryDate)\n\(items)\n")
            return alertWithTitle("Product is purchased", message: "Product is valid until \(expiryDate)")
        case .expired(let expiryDate, let items):
            print("\(productIds) is expired since \(expiryDate)\n\(items)\n")
            return alertWithTitle("Product expired", message: "Product is expired since \(expiryDate)")
        case .notPurchased:
            print("\(productIds) has never been purchased")
            return alertWithTitle("Not purchased", message: "This product has never been purchased")
        }
    }
    
    func alertForVerifyPurchase(_ result: VerifyPurchaseResult, productId: String) -> UIAlertController {
        
        switch result {
        case .purchased:
            print("\(productId) is purchased")
            return alertWithTitle("Product is purchased", message: "Product will not expire")
        case .notPurchased:
            print("\(productId) has never been purchased")
            return alertWithTitle("Not purchased", message: "This product has never been purchased")
        }
    }
    
    func DisplayAd(){
            self.interstitialAd = FBInterstitialAd(placementID: fbInterstitialAdID)
            self.interstitialAd.delegate = self
            self.interstitialAd.load()
    }
    
    func interstitialAdDidLoad(_ interstitialAd: FBInterstitialAd) {
        self.interstitialAd.show(fromRootViewController: self)
//        timer1?.invalidate()
    }
    func interstitialAdDidClose(_ interstitialAd: FBInterstitialAd) {
        print("Ads close")
        activeFBAd = false;
//        timer1?.fire()
    }
    func interstitialAd(_ interstitialAd: FBInterstitialAd, didFailWithError error: Error) {
        print("ads error, ")
        print(error)
//        timer1?.vali
        
    }
}

class NavigatorGeolocation: NSObject, WKScriptMessageHandler, CLLocationManagerDelegate {

    var locationManager = CLLocationManager();
    var listenersCount = 0;
    var webView: WKWebView!;

    override init() {
        super.init();
        locationManager.delegate = self;
    }

    func setWebView(webView: WKWebView) {
        if (!loginHelperEnabled) {
            webView.configuration.userContentController.add(self, name: "listenerAdded");
            webView.configuration.userContentController.add(self, name: "listenerRemoved");
        } else {
            loginHelperEnabled = false
        }
        self.webView = webView;
    }

    func locationServicesIsEnabled() -> Bool {
        return (CLLocationManager.locationServicesEnabled()) ? true : false;
    }

    func authorizationStatusNeedRequest(status: CLAuthorizationStatus) -> Bool {
        return (status == .notDetermined) ? true : false;
    }

    func authorizationStatusIsGranted(status: CLAuthorizationStatus) -> Bool {
        return (status == .authorizedAlways || status == .authorizedWhenInUse) ? true : false;
    }

    func authorizationStatusIsDenied(status: CLAuthorizationStatus) -> Bool {
        return (status == .restricted || status == .denied) ? true : false;
    }

    func onLocationServicesIsDisabled() {
        webView.evaluateJavaScript("navigator.geolocation.helper.error(2, 'Location services disabled');");
    }

    func onAuthorizationStatusNeedRequest() {
        locationManager.requestWhenInUseAuthorization();
    }

    func onAuthorizationStatusIsGranted() {
        locationManager.startUpdatingLocation();
    }

    func onAuthorizationStatusIsDenied() {
        webView.evaluateJavaScript("navigator.geolocation.helper.error(1, 'App does not have location permission');");
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if (message.name == "listenerAdded") {
            listenersCount += 1;

            if (!locationServicesIsEnabled()) {
                onLocationServicesIsDisabled();
            }
            else if (authorizationStatusIsDenied(status: CLLocationManager.authorizationStatus())) {
                onAuthorizationStatusIsDenied();
            }
            else if (authorizationStatusNeedRequest(status: CLLocationManager.authorizationStatus())) {
                onAuthorizationStatusNeedRequest();
            }
            else if (authorizationStatusIsGranted(status: CLLocationManager.authorizationStatus())) {
                onAuthorizationStatusIsGranted();
            }
        }
        else if (message.name == "listenerRemoved") {
            listenersCount -= 1;

            // no listener left in web view to wait for position
            if (listenersCount == 0) {
                locationManager.stopUpdatingLocation();
            }
        }
    }

    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        // didChangeAuthorization is also called at app startup, so this condition checks listeners
        // count before doing anything otherwise app will start location service without reason
        if (listenersCount > 0) {
            if (authorizationStatusIsDenied(status: status)) {
                onAuthorizationStatusIsDenied();
            }
            else if (authorizationStatusIsGranted(status: status)) {
                onAuthorizationStatusIsGranted();
            }
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        if let location = locations.last {
            webView.evaluateJavaScript("navigator.geolocation.helper.success('\(location.timestamp)', \(location.coordinate.latitude), \(location.coordinate.longitude), \(location.altitude), \(location.horizontalAccuracy), \(location.verticalAccuracy), \(location.course), \(location.speed));");
        }
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        webView.evaluateJavaScript("navigator.geolocation.helper.error(2, 'Failed to get position (\(error.localizedDescription))');");
    }

    func getJavaScripToEvaluate() -> String {
        let javaScripToEvaluate = """
            // management for success and error listeners and its calling
            navigator.geolocation.helper = {
                listeners: {},
                noop: function() {},
                id: function() {
                    var min = 1, max = 1000;
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                },
                clear: function(isError) {
                    for (var id in this.listeners) {
                        if (isError || this.listeners[id].onetime) {
                            navigator.geolocation.clearWatch(id);
                        }
                    }
                },
                success: function(timestamp, latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, speed) {
                    var position = {
                        timestamp: new Date(timestamp).getTime() || new Date().getTime(), // safari can not parse date format returned by swift e.g. 2019-12-27 15:46:59 +0000 (fallback used because we trust that safari will learn it in future because chrome knows that format)
                        coords: {
                            latitude: latitude,
                            longitude: longitude,
                            altitude: altitude,
                            accuracy: accuracy,
                            altitudeAccuracy: altitudeAccuracy,
                            heading: (heading > 0) ? heading : null,
                            speed: (speed > 0) ? speed : null
                        }
                    };
                    for (var id in this.listeners) {
                        this.listeners[id].success(position);
                    }
                    this.clear(false);
                },
                error: function(code, message) {
                    var error = {
                        PERMISSION_DENIED: 1,
                        POSITION_UNAVAILABLE: 2,
                        TIMEOUT: 3,
                        code: code,
                        message: message
                    };
                    for (var id in this.listeners) {
                        this.listeners[id].error(error);
                    }
                    this.clear(true);
                }
            };

            // @override getCurrentPosition()
            navigator.geolocation.getCurrentPosition = function(success, error, options) {
                var id = this.helper.id();
                this.helper.listeners[id] = { onetime: true, success: success || this.noop, error: error || this.noop };
                window.webkit.messageHandlers.listenerAdded.postMessage("");
            };

            // @override watchPosition()
            navigator.geolocation.watchPosition = function(success, error, options) {
                var id = this.helper.id();
                this.helper.listeners[id] = { onetime: false, success: success || this.noop, error: error || this.noop };
                window.webkit.messageHandlers.listenerAdded.postMessage("");
                return id;
            };

            // @override clearWatch()
            navigator.geolocation.clearWatch = function(id) {
                var idExists = (this.helper.listeners[id]) ? true : false;
                if (idExists) {
                    this.helper.listeners[id] = null;
                    delete this.helper.listeners[id];
                    window.webkit.messageHandlers.listenerRemoved.postMessage("");
                }
            };
        """;

        return javaScripToEvaluate;
    }

}

///Dynamic icon
extension WebViewController {
    func changeIcon(to name: String?) {
        //Check if the app supports alternating icons
        guard UIApplication.shared.supportsAlternateIcons else {
            return;
        }
        
        //Change the icon to a specific image with given name
        UIApplication.shared.setAlternateIconName(name) { (error) in
            //After app icon changed, print our error or success message
            if let error = error {
                print("App icon failed to due to \(error.localizedDescription)")
            } else {
                print("App icon changed successfully.")
            }
        }
    }
}

///Show / Hide Loading Sign
extension WebViewController {
    
    func showIndicator() {
        loadingSign.isHidden = false
        loadingSign.startAnimating()
    }
    
    func hideIndicator() {
        loadingSign.isHidden = true
        loadingSign.stopAnimating()
    }
}

/// UI Orientation Check
func UIOrientationIsPortrait() -> Bool {
    
    if #available(iOS 13, *) {
        let interfaceOrientation = UIApplication.shared.windows.first?.windowScene?.interfaceOrientation ?? UIInterfaceOrientation.unknown
        if (interfaceOrientation == .portrait) {
            return true
        }
    } else {
        // Less accurate method; will not register portrait mode when the device is lying flat down
        if UIDevice.current.orientation.isPortrait {
            return true
        }
    }
    return false
}

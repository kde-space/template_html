(function($) {
	$(function() {
		// グロナビ開閉制御
		toggleOpenGNav();

		// ロールオーバー
		rollover('.js-rollover');

		//アコーディオン
		accordion();

		// タブ切り替え
		tab();

		// スムーススクロール
		$('a').smoothScroll({
			duration: 200
		});
	});

	/**
	 * グロナビ開閉制御
	 */
	function toggleOpenGNav() {
		var $header     = $('#js-header');
		var $triggerBtn = $('#js-headerTrigger');
		var $body       = $('body');
		var CLASS_OPEN  = 'is-header-open';
		var isOpen      = false;

		$triggerBtn.on('click', function() {
			if (!$header.hasClass(CLASS_OPEN)) {
				$header.addClass(CLASS_OPEN);
				$body.addClass(CLASS_OPEN);
				isOpen = true;
				closeGNavPoint();
			} else {
				$header.removeClass(CLASS_OPEN);
				$body.removeClass(CLASS_OPEN);
				isOpen = false;
			}
		});

		/**
		 * ブレイクポイントより大きくなったらグロナビを閉じた状態にする
		 */
		function closeGNavPoint() {
			var $window     = $(window);
			var BREAK_POINT = 980;
			var windowWidth = window.innerWidth ? window.innerWidth : $window.width();

			$window.on('resize.headerWatch', _.throttle(function() {
				windowWidth = window.innerWidth ? window.innerWidth : $window.width();
				if (windowWidth > BREAK_POINT && isOpen === true) {
					$triggerBtn.trigger('click');
					isOpen = false;
				} else if (isOpen === false) {
					$window.off('resize.headerWatch');
				}
			}, 100));
		}
	}

	/**
	* ロールオーバーでの画像切替
	*/
	function rollover(selecter) {
		$(selecter).each(function () {

			/*============================
			* 変数の定義
			*============================*/

			var $this = $(this);
			var imgSrc_off = $this.attr('src');
			var imgSrc_on = imgSrc_off.replace(/^(.+)(\.[a-z]+)$/, '$1_on$2');

			// 画像のプリロード
			$('<img>').attr('src', imgSrc_on);

			/*============================
			* イベントの設定
			*============================*/

			$this.hover(function () {
				$this.attr('src', imgSrc_on);
			}, function () {
				$this.attr('src', imgSrc_off);
			});
		});
	}


	/**
	* アコーディオン
	* 予め開いておきたい場合は、親要素にOPEN_CLASS_NAMEを付与して下さい。
	*/
	function accordion() {
		$('.js-accordion').each(function () {

			/*============================
			* 変数の定義
			*============================*/

			var $container = $(this);
			var $head = $container.find('.js-accordion__head');
			var $body = $container.find('.js-accordion__body');
			var OPEN_CLASS_NAME = 'is-open';
			var speed = 300; // スライドの速さ

			/*============================
			* イベントの設定
			*============================*/

			$head.on('click', function () {
				// オープンクラスが付いている場合
				if ($container.hasClass(OPEN_CLASS_NAME)) {
					$container.removeClass(OPEN_CLASS_NAME);
				}
				// 付いていない場合
				else {
					$container.addClass(OPEN_CLASS_NAME);
				}
				// 子要素のクラスとスライドのトグル実行
				changeClassToggleSlide();
			});

			/*============================
			* 初期化
			*============================*/
			// オープンクラスが付いていなかったらコンテンツを非表示にする
			if(!$container.hasClass(OPEN_CLASS_NAME)) {
				$body.hide();
			}
			// 子要素のクラスとスライドのトグル実行
			changeClassToggleSlide();

			/*============================
			* 関数の定義
			*============================*/

			/**
			* 親のクラスの状態に応じて
			* 1.子要素のクラス切り替え
			* 2.コンテンツのスライド
			*----------------------------*/
			function changeClassToggleSlide() {
				if($container.hasClass(OPEN_CLASS_NAME)) {
					$head.addClass(OPEN_CLASS_NAME);
					$body.addClass(OPEN_CLASS_NAME).stop().slideDown(speed);
				} else {
					$head.removeClass(OPEN_CLASS_NAME);
					$body.removeClass(OPEN_CLASS_NAME).stop().slideUp(speed);
				}
			}
		});
	}

	/**
	* アコーディオン（画像切替機能付き）
	* 予め開いておきたい場合は、親要素にOPEN_CLASS_NAMEを付与して下さい。
	*/
	function accordion_img() {
		$('.js-accordion').each(function () {

			/*============================
			* 変数の定義
			*============================*/

			var $container = $(this);
			var $head = $container.find('.js-accordion-head');
			var $body = $container.find('.js-accordion-body');
			var OPEN_CLASS_NAME = 'is-open';
			var SPEED = 500; // スライドの速さ
			var changedSrcObj = getImgSrc($head); // 画像を切り替え用のオブジェクト作成

			/*============================
			* イベントの設定
			*============================*/

			$head.on('click', function () {
				// オープンクラスが付いている場合
				if ($container.hasClass(OPEN_CLASS_NAME)) {
					$container.removeClass(OPEN_CLASS_NAME);
					// クローズ時用の画像に切り替え
					changeImgSrc(changedSrcObj, 'close');
				}
				// 付いていない場合
				else {
					$container.addClass(OPEN_CLASS_NAME);
					// オープン時用の画像に切り替え
					changeImgSrc(changedSrcObj, 'open');
				}
				// 子要素のクラスとスライドのトグル実行
				changeClassToggleSlide();
			});

			/*============================
			* 初期化
			*============================*/

			// オープンクラスが付いていたら、_on付き画像にする
			if($container.hasClass(OPEN_CLASS_NAME)) {
				changeImgSrc(changedSrcObj, 'open');
			} else {
				$body.hide();
			}
			// 子要素のクラスとスライドのトグル実行
			changeClassToggleSlide();

			/*============================
			* 関数の定義
			*============================*/

			/**
			* 親のクラスの状態に応じて
			* 1.子要素のクラス切り替え
			* 2.コンテンツのスライド
			*----------------------------*/
			function changeClassToggleSlide() {
				if($container.hasClass(OPEN_CLASS_NAME)) {
					$head.addClass(OPEN_CLASS_NAME);
					$body.addClass(OPEN_CLASS_NAME).stop().slideDown(SPEED);
				} else {
					$head.removeClass(OPEN_CLASS_NAME);
					$body.removeClass(OPEN_CLASS_NAME).stop().slideUp(SPEED);
				}
			}

			/**
			* 切り替えたい要素の画像を
			* 1.src情報（onとoff）をオブジェクトとして返す
			* 2.on画像のプリロードを行う
			*----------------------------*/
			function getImgSrc(elem) {
				var img = elem.find('img');
				var obj = {
					$item: img,
					imgSrc_off: img.attr('src'),
					imgSrc_on: img.attr('src').replace(/^(.+)(\.[a-z]+)$/, '$1_on$2')
				}
				//画像のプリロード
				$('<img>').attr('src', obj.imgSrc_on);

				return obj;
			}

			/**
			* 状態に応じてoff/on画像を切り替える
			*----------------------------*/
			function changeImgSrc(obj, flag) {
				if (flag === 'open') {
					obj.$item.attr('src', obj.imgSrc_on);
				} else {
					obj.$item.attr('src', obj.imgSrc_off);
				}
			}
		});
	}

	/**
	* タブ
	* 予め開いておきたいタブの見出しのa要素に、ACTIVE_CLASS_NAMEを付与して下さい。
	*/
	function tab() {
		$('.js-tab').each(function () {

			/*============================
			* 変数の定義
			*============================*/

			var $container = $(this);
			var $head = $container.find('.tab-head');
			var $anchors = $head.find('a');
			var $panels = $container.find('.tab-panel');
			var ACTIVE_CLASS_NAME = 'is-active';
			var DURATION = 300;

			// 最後にクリックされたa要素とパネルを保存する変数
			var $lastAnchor;
			var $lastPanel;

			/*============================
			* 初期化
			*============================*/

			// アクティブになっている要素と対応するパネルを保存
			$lastAnchor = $anchors.filter('.' + ACTIVE_CLASS_NAME);
			$lastPanel = $($lastAnchor.attr('href'));

			$panels.hide();
			$lastPanel.show();

			/*============================
			* イベントの設定
			*============================*/

			$anchors.on('click', function (e) {
				e.preventDefault();
				// クリックされた要素とパネルを取得
				var $currentAnchor = $(this);
				var $currentPanel = $($currentAnchor.attr('href'));

				// クリックされた要素と表示されている要素が同一だったら以降の処理を中断
				if ($currentAnchor.get(0) === $lastAnchor.get(0)) {
					return;
				}

				// 表示されていた要素をフェードアウト
				$lastPanel.stop().fadeOut(DURATION, function () {
					$lastAnchor.removeClass(ACTIVE_CLASS_NAME);
					$currentAnchor.addClass(ACTIVE_CLASS_NAME);
					$currentPanel.stop().fadeIn(DURATION);

					// 最後にクリックされた要素とパネルを入れ替える
					$lastAnchor = $currentAnchor;
					$lastPanel = $currentPanel;
				});
			});
		});
	}

	/**
	* スムーススクロール
	*/
	$.fn.smoothScroll = function (options) {
		var hrefData = '',
			targetPos = 0,
			targetObj = '';

		var defaults = {
			easing : 'swing',
			duration : 400,
			positioning : 0,
			callback : function () {}
		};
		var setting = $.extend(defaults, options);

		if (navigator.userAgent.match(/webkit/i)) {
			targetObj = 'body';
		} else {
			targetObj = 'html';
		}
		$(this).on('click', function (event) {
			hrefData = $(this).attr('href');
			if (hrefData.indexOf('#') !== 0 || $(hrefData).length === 0) { return; }
			event.preventDefault();
			targetPos = $(hrefData).offset().top + setting.positioning;
			$(targetObj).animate({
				scrollTop : targetPos
			}, setting.duration, setting.easing, setting.callback);
		});
	};
}(jQuery));



jQuery(function ($) {

	accordion_normal();

});


/**
* アコーディオン（画像切り替え機能なし）
* 予め開いておきたい場合は、親要素にOPEN_CLASS_NAMEを付与して下さい。
*/
function accordion_normal() {
	$('.js-accordion').each(function () {

		/*============================
		* 変数の定義
		*============================*/

		var $container = $(this);
		var $head = $container.find('.accordion-head');
		var $body = $container.find('.accordion-body');
		var OPEN_CLASS_NAME = 'is-open';
		var speed = 300; // スライドの速さ

		/*============================
		* イベントの設定
		*============================*/

		$head.on('click', function () {
			// オープンクラスが付いている場合
			if ($container.hasClass(OPEN_CLASS_NAME)) {
				$container.removeClass(OPEN_CLASS_NAME);
			}
			// 付いていない場合
			else {
				$container.addClass(OPEN_CLASS_NAME);
			}
			// 子要素のクラスとスライドのトグル実行
			changeClassToggleSlide();
		});

		/*============================
		* 初期化
		*============================*/
		// オープンクラスが付いていなかったらコンテンツを非表示にする
		if(!$container.hasClass(OPEN_CLASS_NAME)) {
			$body.hide();
		}
		// 子要素のクラスとスライドのトグル実行
		changeClassToggleSlide();

		/*============================
		* 関数の定義
		*============================*/

		/**
		* 親のクラスの状態に応じて
		* 1.子要素のクラス切り替え
		* 2.コンテンツのスライド
		*----------------------------*/
		function changeClassToggleSlide() {
			if($container.hasClass(OPEN_CLASS_NAME)) {
				$head.addClass(OPEN_CLASS_NAME);
				$body.addClass(OPEN_CLASS_NAME).stop().slideDown(speed);
			} else {
				$head.removeClass(OPEN_CLASS_NAME);
				$body.removeClass(OPEN_CLASS_NAME).stop().slideUp(speed);
			}
		}
	});
}




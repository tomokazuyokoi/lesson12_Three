(function () {
    window.addEventListener('load', function(){
        /**
         * 初期設定
         */
        var width = window.innerWidth;
        var height = window.innerHeight;

        /**
         * シーンの生成
         */
        scene = new THREE.Scene();

        // フォグを設定 (色, 開始距離, 終点距離);
        scene.fog = new THREE.Fog(0x111111, 50, 800);

        /**
         * カメラの設定
         */
        // 画角、アスペクト比、描画開始距離、描画終了距離
        var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

        camera.position.set(150, 150, 150);
        // カメラをシーンの中心に向ける
        console.log(scene.position);
        camera.lookAt(scene.position);

        /**
         * ライトの設定
         */
        // 環境光源
        var ambientLight = new THREE.AmbientLight(0x404040, 1.0);
        scene.add(ambientLight);
        // 平行光源（太陽光）
        var directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(0, 100, 30);
        scene.add(directionalLight);

        /**
         * ヘルパーの設定
         */
        var axixHelper = new THREE.AxisHelper(1000);
        scene.add(axixHelper);

        var gridHelper = new THREE.GridHelper(1000, 50);
        scene.add(gridHelper);

        // var lightHelper = new THREE.DirectionalLightHelper(directionalLight, 20);
        // scene.add(lightHelper);

        /**
         * パーティクルの生成
         */
        // 1.Geometry
        var geometry = new THREE.Geometry();

        for ( var i = 0; i < 10000; i ++ ) {

            // ジオメトリの設定
            var particle = new THREE.Vector3();
            particle.x = THREE.Math.randFloatSpread( 500 );
            particle.y = THREE.Math.randFloatSpread( 500 );
            particle.z = THREE.Math.randFloatSpread( 500 );

            // ジオメトリの頂点情報を登録
            geometry.vertices.push( particle );
        }

        // 2.Material
        var material = new THREE.PointsMaterial(
        {
            size: 4,
            color: 0x00ff00,
            transparent: true, // opacityを有効
            opacity: 0.6,
        });

        // 3. Mesh
        var field = new THREE.Points( geometry, material );

        scene.add( field );


        /**
         * rendererの設定
         */
        var renderer = new THREE.WebGLRenderer();
        // サイズ
        renderer.setSize(width, height);
        // スマホ対応 デバイスピクセル比
        renderer.setPixelRatio(window.devicePixelRatio);
        // 背景色
        renderer.setClearColor(0x111111);
        // HTMLヘの書き出し
        document.getElementById('scene').appendChild(renderer.domElement);

        /**
         * コントローラー
         */
        var controls = new THREE.OrbitControls(camera, renderer.domElement);

        // 動きを滑らかにする
        controls.enableDamping = true;
        controls.dampingFactor = 0.2;

        /**
         * アニメーション
         */
        function animate()
        {
            // 60fpsでアニメーションさせる
            requestAnimationFrame( animate );
            // 回転
            field.rotateY(0.001);

            // コントローラを更新
            controls.update();

            // レンダリングの実行
            renderer.render(scene, camera);
        }
        animate();

    });
}());
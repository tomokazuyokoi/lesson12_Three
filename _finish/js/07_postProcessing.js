(function () {
    window.addEventListener('load', function(){

        /**
         * 初期設定
         */
        var width = window.innerWidth;
        var halfWidth = width / 2;
        var height = window.innerHeight;
        var halfHeight = height / 2;

        /**
         * シーンの生成
         */
        scene = new THREE.Scene();

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
        // var axixHelper = new THREE.AxisHelper(1000);
        // scene.add(axixHelper);

        // var gridHelper = new THREE.GridHelper(1000, 50);
        // scene.add(gridHelper);

        // var lightHelper = new THREE.DirectionalLightHelper(directionalLight, 20);
        // scene.add(lightHelper);

        /**
         * オブジェクトの生成
         */
        // 1.Geometry
        // box (幅, 高さ, 奥行き)
        // var geometry = new THREE.BoxGeometry(50,50,50);
        // geometry.wireframe = true;
        // // 2. material
        // var material = new THREE.MeshStandardMaterial({
        //     color: 0xFF0000,
        //     wireframe: false,
        // })
        // // 3. Mesh
        // var cube = new THREE.Mesh(geometry, material);
        // // 4. Meshをシーンに追加
        // scene.add(cube);
        // cube.position.set(80, 0, 0);

        // 1.Geometry
        // sphere (半径, 経度分割数, 緯度分割数)
        var geometry = new THREE.SphereGeometry(100, 64, 64);
        // 2. material
        var loader = new THREE.TextureLoader();
        var texture = loader.load("img/earthmap1k.jpg");
        var material = new THREE.MeshStandardMaterial({
            map: texture,
        });
        // 3. Mesh
        var sphere = new THREE.Mesh(geometry, material);
        // 4. Meshをシーンに追加
        scene.add(sphere);
        sphere.position.set(0, 0, 0);

        /**
         * rendererの設定
         */
        var renderer = new THREE.WebGLRenderer();
        // サイズ
        renderer.setSize(width, height);
        // スマホ対応 デバイスピクセル比
        renderer.setPixelRatio(window.devicePixelRatio);
        // 背景色
        renderer.setClearColor(0x000000);
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
         * ポストプロセッシングのエフェクト設定
         */
        //
        var renderPass = new THREE.RenderPass(scene, camera);
        var toScreen = new THREE.ShaderPass(THREE.CopyShader);
        toScreen.renderToScreen = true;
        var composer = new THREE.EffectComposer(renderer);
        composer.addPass(renderPass);
        composer.addPass(toScreen);


        var renderScene = new THREE.TexturePass(composer.renderTarget2);
        // 1 lower left corner
        var bloomPass = new THREE.BloomPass(2.5, 30, 2.0, 512);
        var composer1 = new THREE.EffectComposer(renderer);
        composer1.addPass(renderScene);
        composer1.addPass(bloomPass);
        composer1.addPass(toScreen);

        // 2 lower right corner
        var dotScreenPass = new THREE.DotScreenPass(new THREE.Vector2( 0, 0 ), 0, 0.2); 
        var composer2 = new THREE.EffectComposer(renderer);
        composer2.addPass(renderScene);
        composer2.addPass(dotScreenPass);
        composer2.addPass(toScreen);

        // 3 upper left corner
        var composer3 = new THREE.EffectComposer(renderer);
        composer3.addPass(renderScene);
        composer3.addPass(toScreen);

        // 4 upper right corner
        var filmPass = new THREE.FilmPass(0.8, 0.325, 256, false);
        filmPass.renderToScreen = true;
        var composer4 = new THREE.EffectComposer(renderer);
        composer4.addPass(renderScene);
        composer4.addPass(filmPass);
        composer4.addPass(toScreen);

        /**
         * アニメーション
         */
        function animate()
        {
            // 60fpsでアニメーションさせる
            requestAnimationFrame( animate );
            // 回転
            // cube.rotateY(0.005);
            sphere.rotateY(0.005);

            // コントローラを更新
            controls.update();

            //
            renderer.autoClear = false;
            renderer.clear();
            
            // レンダリングの実行
            // renderer.render(scene, camera);
            renderer.setViewport(0, 0, width, height);
            composer.render();

            renderer.setViewport(0, 0, halfWidth, halfHeight);
            composer1.render();

            renderer.setViewport(halfWidth, 0, halfWidth, halfHeight);
            composer2.render();

            renderer.setViewport(0, halfHeight, halfWidth, halfHeight);
            composer3.render();

            renderer.setViewport(halfWidth, halfHeight, halfWidth, halfHeight);
            composer4.render();
        }
        animate();
    });
}());
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
         * オブジェクトの生成
         */
        // 1.Geometry
        // box (幅, 高さ, 奥行き)
        var geometry = new THREE.BoxGeometry(50,50,50);
        geometry.wireframe = true;
        // 2. material
        var material = new THREE.MeshStandardMaterial({
            color: 0xFF0000,
            wireframe: false,
        })
        // 3. Mesh
        var cube = new THREE.Mesh(geometry, material);
        // 4. Meshをシーンに追加
        scene.add(cube);
        cube.position.set(80, 0, 0);

        // 1.Geometry
        // sphere (半径, 経度分割数, 緯度分割数)
        var geometry = new THREE.SphereGeometry(30,64,64);
        // 2. material
        var material = new THREE.MeshStandardMaterial({
            color: 0x00FF00,
            wireframe: true,
         })
        // 3. Mesh
        var sphere = new THREE.Mesh(geometry, material);
        // 4. Meshをシーンに追加
        scene.add(sphere);
        sphere.position.set(-80, 0, 0);

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

        // レンダリングの実行
        renderer.render(scene, camera);
    });
}());
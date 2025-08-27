/**
 * Test des nouvelles animations ultra-détaillées
 * Crystal Lattice Symphony et Neural Galaxy Evolution
 */

class AnimationTester {
  constructor() {
    this.svg = document.getElementById('reactiveSVG');
    this.testResults = {
      crystal: false,
      galaxy: false
    };
  }

  async testCrystalLatticeAnimation() {
    console.log('🧪 Test de Crystal Lattice Animation...');
    
    try {
      // Vérifier que la classe existe
      if (typeof CrystalLatticeAnimation === 'undefined') {
        throw new Error('CrystalLatticeAnimation class not found');
      }

      // Créer l'animation
      const crystalAnimation = new CrystalLatticeAnimation(this.svg, {
        enable3D: true,
        enableGlow: true,
        colorMode: 'frequency'
      });

      // Initialiser
      crystalAnimation.init();

      // Vérifier les éléments créés
      const crystals = this.svg.querySelector('#animation-crystals');
      const lattice = this.svg.querySelector('#animation-lattice');
      const refraction = this.svg.querySelector('#animation-refraction');
      const diffraction = this.svg.querySelector('#animation-diffraction');

      if (!crystals || !lattice || !refraction || !diffraction) {
        throw new Error('Missing animation containers');
      }

      // Vérifier les points de réseau
      const latticePoints = lattice.querySelectorAll('circle');
      if (latticePoints.length < 100) {
        throw new Error('Insufficient lattice points');
      }

      // Vérifier les cristaux
      const crystalElements = crystals.querySelectorAll('g[id^="crystal-"]');
      if (crystalElements.length < 10) {
        throw new Error('Insufficient crystals');
      }

      // Simuler des données audio
      const testAudioData = {
        bass: 0.5,
        mid: 0.3,
        high: 0.7,
        beat: true,
        raw: new Uint8Array(128).fill(128)
      };

      // Tester l'update
      crystalAnimation.update(testAudioData);

      console.log('✅ Crystal Lattice Animation: SUCCESS');
      console.log(`   - Points de réseau: ${latticePoints.length}`);
      console.log(`   - Cristaux créés: ${crystalElements.length}`);
      console.log(`   - Conteneurs: 4/4`);
      
      this.testResults.crystal = true;
      return true;

    } catch (error) {
      console.error('❌ Crystal Lattice Animation: FAILED');
      console.error('   Error:', error.message);
      this.testResults.crystal = false;
      return false;
    }
  }

  async testNeuralGalaxyAnimation() {
    console.log('🧪 Test de Neural Galaxy Animation...');
    
    try {
      // Vérifier que la classe existe
      if (typeof NeuralGalaxyAnimation === 'undefined') {
        throw new Error('NeuralGalaxyAnimation class not found');
      }

      // Créer l'animation
      const galaxyAnimation = new NeuralGalaxyAnimation(this.svg, {
        enable3D: true,
        enableGlow: true,
        colorMode: 'frequency'
      });

      // Initialiser
      galaxyAnimation.init();

      // Vérifier les éléments créés
      const neural = this.svg.querySelector('#animation-neural-galaxy');
      const clusters = this.svg.querySelector('#animation-galaxy-clusters');
      const quantum = this.svg.querySelector('#animation-quantum-connections');
      const gravity = this.svg.querySelector('#animation-gravity-wells');

      if (!neural || !clusters || !quantum || !gravity) {
        throw new Error('Missing animation containers');
      }

      // Vérifier les nœuds neuronaux
      const neuralNodes = neural.querySelectorAll('circle');
      if (neuralNodes.length < 100) {
        throw new Error('Insufficient neural nodes');
      }

      // Vérifier les amas galactiques
      const galaxyClusters = clusters.querySelectorAll('g[id^="galaxy-cluster-"]');
      if (galaxyClusters.length < 5) {
        throw new Error('Insufficient galaxy clusters');
      }

      // Vérifier les puits de gravité
      const gravityWells = gravity.querySelectorAll('circle');
      if (gravityWells.length < 3) {
        throw new Error('Insufficient gravity wells');
      }

      // Simuler des données audio
      const testAudioData = {
        bass: 0.6,
        mid: 0.4,
        high: 0.8,
        beat: false,
        raw: new Uint8Array(128).fill(150)
      };

      // Tester l'update
      galaxyAnimation.update(testAudioData);

      console.log('✅ Neural Galaxy Animation: SUCCESS');
      console.log(`   - Nœuds neuronaux: ${neuralNodes.length}`);
      console.log(`   - Amas galactiques: ${galaxyClusters.length}`);
      console.log(`   - Puits de gravité: ${gravityWells.length}`);
      console.log(`   - Conteneurs: 4/4`);
      
      this.testResults.galaxy = true;
      return true;

    } catch (error) {
      console.error('❌ Neural Galaxy Animation: FAILED');
      console.error('   Error:', error.message);
      this.testResults.galaxy = false;
      return false;
    }
  }

  async runAllTests() {
    console.log('🚀 Démarrage des tests des nouvelles animations...');
    console.log('================================================');

    const crystalResult = await this.testCrystalLatticeAnimation();
    console.log('');
    const galaxyResult = await this.testNeuralGalaxyAnimation();
    console.log('');

    console.log('📊 Résultats des tests:');
    console.log('================================================');
    console.log(`Crystal Lattice: ${crystalResult ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Neural Galaxy: ${galaxyResult ? '✅ PASS' : '❌ FAIL'}`);
    console.log('');

    if (crystalResult && galaxyResult) {
      console.log('🎉 Tous les tests sont passés avec succès !');
      console.log('Les nouvelles animations sont prêtes à être utilisées.');
    } else {
      console.log('⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus.');
    }

    return this.testResults;
  }

  // Fonction pour tester les performances
  testPerformance(animationClass, iterations = 100) {
    console.log(`🧪 Test de performance pour ${animationClass.name}...`);
    
    const startTime = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      const animation = new animationClass(this.svg);
      animation.init();
      
      const testData = {
        bass: Math.random(),
        mid: Math.random(),
        high: Math.random(),
        beat: Math.random() > 0.8,
        raw: new Uint8Array(128).fill(Math.floor(Math.random() * 255))
      };
      
      animation.update(testData);
      animation.clear();
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    const avgTime = duration / iterations;
    
    console.log(`   - ${iterations} itérations en ${duration.toFixed(2)}ms`);
    console.log(`   - Temps moyen par frame: ${avgTime.toFixed(2)}ms`);
    console.log(`   - FPS théorique: ${(1000 / avgTime).toFixed(1)}`);
    
    return {
      totalTime: duration,
      avgTime: avgTime,
      fps: 1000 / avgTime
    };
  }
}

// Fonction pour lancer les tests
function runAnimationTests() {
  const tester = new AnimationTester();
  return tester.runAllTests();
}

// Fonction pour tester les performances
function testAnimationPerformance() {
  const tester = new AnimationTester();
  
  console.log('🚀 Test de performance des nouvelles animations...');
  console.log('================================================');
  
  if (typeof CrystalLatticeAnimation !== 'undefined') {
    tester.testPerformance(CrystalLatticeAnimation);
    console.log('');
  }
  
  if (typeof NeuralGalaxyAnimation !== 'undefined') {
    tester.testPerformance(NeuralGalaxyAnimation);
    console.log('');
  }
}

// Exporter pour utilisation globale
window.runAnimationTests = runAnimationTests;
window.testAnimationPerformance = testAnimationPerformance;

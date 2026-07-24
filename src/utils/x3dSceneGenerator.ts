/**
 * Generates the complete X3D 3.3 XML scene string representing the 3D human skeleton and muscular system.
 * Contains joint hierarchy DEF nodes and muscle transform/material DEF nodes for X_ITE manipulation.
 */
export function generateHumanAnatomyX3DXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE X3D PUBLIC "ISO//Web3D//DTD X3D 3.3//EN" "https://www.web3d.org/specifications/x3d-3.3.dtd">
<X3D profile='Immersive' version='3.3' xmlns:xsd='http://www.w3.org/2001/XMLSchema-instance' xsd:noNamespaceSchemaLocation='https://www.web3d.org/specifications/x3d-3.3.xsd'>
  <head>
    <meta name='title' content='Human Skeleton and Muscular System'/>
    <meta name='generator' content='Human Muscle Visualizer X_ITE Engine'/>
  </head>
  <Scene>
    <WorldInfo title='Human Muscle Visualizer'/>
    
    <!-- ENVIRONMENT LIGHTING & NAVIGATION -->
    <NavigationInfo type='"EXAMINE" "ANY"' headLight='true'/>
    <DirectionalLight direction='0.6 -1 -0.8' intensity='1.1' color='1 0.98 0.95'/>
    <DirectionalLight direction='-0.6 0.5 0.8' intensity='0.6' color='0.6 0.75 1'/>
    <DirectionalLight direction='0 1 0' intensity='0.3' color='0.9 0.9 1'/>

    <!-- VIEWPOINTS -->
    <Viewpoint DEF='VP_FullBody' description='Full Body Front' position='0 0.0 3.8' orientation='0 1 0 0' fieldOfView='0.85'/>
    <Viewpoint DEF='VP_UpperBody' description='Upper Body Close-up' position='0 0.5 2.2' orientation='0 1 0 0' fieldOfView='0.85'/>
    <Viewpoint DEF='VP_RightArm' description='Arm Mechanics' position='0.6 0.4 1.8' orientation='0 1 0 0' fieldOfView='0.80'/>
    <Viewpoint DEF='VP_Legs' description='Leg Mechanics' position='0.3 -0.6 2.1' orientation='0 1 0 0' fieldOfView='0.80'/>
    <Viewpoint DEF='VP_Posterior' description='Posterior View' position='0 0.0 -3.8' orientation='0 1 0 3.14159' fieldOfView='0.85'/>

    <!-- SHARED BONE MATERIAL -->
    <Appearance DEF='BoneAppearance'>
      <Material diffuseColor='0.88 0.85 0.78' specularColor='0.3 0.3 0.28' shininess='0.25' ambientIntensity='0.3'/>
    </Appearance>

    <!-- SHARED TENDON MATERIAL -->
    <Appearance DEF='TendonAppearance'>
      <Material diffuseColor='0.92 0.92 0.95' specularColor='0.5 0.5 0.5' shininess='0.5' ambientIntensity='0.4'/>
    </Appearance>

    <!-- CENTER ROOT AT PELVIS -->
    <Transform translation='0 0 0'>
      
      <!-- PELVIS BONE -->
      <Transform translation='0 -0.15 0'>
        <Shape>
          <Appearance><Appearance USE='BoneAppearance'/></Appearance>
          <Cylinder radius='0.22' height='0.16'/>
        </Shape>
      </Transform>

      <!-- SPINE & TORSO FLEXION JOINT -->
      <Transform DEF='SpineFlexionJoint' center='0 0.25 0' translation='0 0 0'>
        
        <!-- SPINE COLUMN -->
        <Transform translation='0 0.3 0'>
          <Shape>
            <Appearance><Appearance USE='BoneAppearance'/></Appearance>
            <Cylinder radius='0.05' height='0.55'/>
          </Shape>
        </Transform>

        <!-- RIBCAGE / TORSO -->
        <Transform translation='0 0.52 0' scale='1 1 0.75'>
          <Shape>
            <Appearance><Appearance USE='BoneAppearance'/></Appearance>
            <Sphere radius='0.26'/>
          </Shape>
        </Transform>

        <!-- CLAVICLES / SHOULDER GIRDLE -->
        <Transform translation='0 0.72 0'>
          <Shape>
            <Appearance><Appearance USE='BoneAppearance'/></Appearance>
            <Box size='0.95 0.06 0.12'/>
          </Shape>
        </Transform>

        <!-- ABDOMINIS (ABS) MUSCLE BELLY -->
        <Transform DEF='AbdominisBellyTransform' translation='0 0.22 0.16' scale='1 1 1'>
          <Shape>
            <Appearance>
              <Material DEF='AbdominisMaterial' diffuseColor='0.75 0.2 0.2' shininess='0.4'/>
            </Appearance>
            <Box size='0.26 0.38 0.09'/>
          </Shape>
        </Transform>

        <!-- PECTORALIS MAJOR (CHEST) MUSCLE BELLY -->
        <Transform DEF='PectoralisBellyTransform' translation='0 0.58 0.18' scale='1 1 1'>
          <Shape>
            <Appearance>
              <Material DEF='PectoralisMaterial' diffuseColor='0.80 0.22 0.22' shininess='0.4'/>
            </Appearance>
            <Box size='0.54 0.20 0.10'/>
          </Shape>
        </Transform>

        <!-- NECK JOINT & SKULL -->
        <Transform DEF='NeckJoint' center='0 0.85 0' translation='0 0 0'>
          <!-- NECK BONE -->
          <Transform translation='0 0.82 0'>
            <Shape>
              <Appearance><Appearance USE='BoneAppearance'/></Appearance>
              <Cylinder radius='0.05' height='0.16'/>
            </Shape>
          </Transform>
          <!-- SKULL -->
          <Transform translation='0 0.98 0.02'>
            <Shape>
              <Appearance><Appearance USE='BoneAppearance'/></Appearance>
              <Sphere radius='0.15'/>
            </Shape>
          </Transform>
          <!-- TRAPEZIUS MUSCLE BELLY -->
          <Transform DEF='TrapeziusBellyTransform' translation='0 0.78 -0.12' scale='1 1 1'>
            <Shape>
              <Appearance>
                <Material DEF='TrapeziusMaterial' diffuseColor='0.70 0.22 0.25' shininess='0.4'/>
              </Appearance>
              <Cone bottomRadius='0.28' height='0.28'/>
            </Shape>
          </Transform>
        </Transform>

        <!-- ================= RIGHT ARM ASSEMBLY ================= -->
        <Transform DEF='RightShoulderJoint' center='0.48 0.72 0' translation='0 0 0'>
          
          <!-- DELTOID MUSCLE BELLY -->
          <Transform DEF='DeltoidBellyTransform' translation='0.48 0.68 0' scale='1 1 1'>
            <Shape>
              <Appearance>
                <Material DEF='DeltoidMaterial' diffuseColor='0.78 0.24 0.24' shininess='0.4'/>
              </Appearance>
              <Sphere radius='0.14'/>
            </Shape>
          </Transform>

          <!-- HUMERUS (UPPER ARM BONE) -->
          <Transform translation='0.48 0.52 0'>
            <Shape>
              <Appearance><Appearance USE='BoneAppearance'/></Appearance>
              <Cylinder radius='0.04' height='0.36'/>
            </Shape>
          </Transform>

          <!-- BICEPS BRACHII (ANTERIOR ARM) -->
          <Transform DEF='BicepsBellyTransform' translation='0.48 0.52 0.06' scale='1 1 1'>
            <Shape>
              <Appearance>
                <Material DEF='BicepsMaterial' diffuseColor='0.82 0.2 0.2' shininess='0.5'/>
              </Appearance>
              <Cylinder radius='0.065' height='0.26'/>
            </Shape>
          </Transform>

          <!-- BICEPS FORCE VECTOR ARROW -->
          <Transform DEF='BicepsForceVector' translation='0.48 0.52 0.14' rotation='1 0 0 1.57' scale='1 1 1'>
            <Shape>
              <Appearance>
                <Material DEF='BicepsVectorMat' diffuseColor='0.2 0.8 1.0' emissiveColor='0.1 0.5 0.8'/>
              </Appearance>
              <Cone bottomRadius='0.035' height='0.12'/>
            </Shape>
          </Transform>

          <!-- TRICEPS BRACHII (POSTERIOR ARM) -->
          <Transform DEF='TricepsBellyTransform' translation='0.48 0.52 -0.06' scale='1 1 1'>
            <Shape>
              <Appearance>
                <Material DEF='TricepsMaterial' diffuseColor='0.72 0.22 0.22' shininess='0.4'/>
              </Appearance>
              <Cylinder radius='0.06' height='0.28'/>
            </Shape>
          </Transform>

          <!-- RIGHT ELBOW JOINT (Pivot at 0.48, 0.34, 0) -->
          <Transform DEF='RightElbowJoint' center='0.48 0.34 0' translation='0 0 0'>
            
            <!-- ELBOW JOINT SPHERE -->
            <Transform translation='0.48 0.34 0'>
              <Shape>
                <Appearance><Appearance USE='BoneAppearance'/></Appearance>
                <Sphere radius='0.055'/>
              </Shape>
            </Transform>

            <!-- RADIUS & ULNA (FOREARM BONES) -->
            <Transform translation='0.48 0.16 0'>
              <Shape>
                <Appearance><Appearance USE='BoneAppearance'/></Appearance>
                <Cylinder radius='0.035' height='0.34'/>
              </Shape>
            </Transform>

            <!-- FOREARM FLEXOR MUSCLE BULGE -->
            <Transform translation='0.48 0.20 0.04' scale='1 1 1'>
              <Shape>
                <Appearance>
                  <Material diffuseColor='0.70 0.22 0.22'/>
                </Appearance>
                <Cylinder radius='0.05' height='0.22'/>
              </Shape>
            </Transform>

            <!-- HAND -->
            <Transform translation='0.48 -0.05 0'>
              <Shape>
                <Appearance><Appearance USE='BoneAppearance'/></Appearance>
                <Box size='0.08 0.12 0.04'/>
              </Shape>
            </Transform>

          </Transform> <!-- END RightElbowJoint -->
        </Transform> <!-- END RightShoulderJoint -->


        <!-- ================= LEFT ARM ASSEMBLY ================= -->
        <Transform DEF='LeftShoulderJoint' center='-0.48 0.72 0' translation='0 0 0'>
          <Transform translation='-0.48 0.52 0'>
            <Shape>
              <Appearance><Appearance USE='BoneAppearance'/></Appearance>
              <Cylinder radius='0.04' height='0.36'/>
            </Shape>
          </Transform>
          <Transform translation='-0.48 0.52 0.05'>
            <Shape>
              <Appearance>
                <Material diffuseColor='0.75 0.22 0.22'/>
              </Appearance>
              <Cylinder radius='0.06' height='0.26'/>
            </Shape>
          </Transform>

          <Transform DEF='LeftElbowJoint' center='-0.48 0.34 0' translation='0 0 0'>
            <Transform translation='-0.48 0.16 0'>
              <Shape>
                <Appearance><Appearance USE='BoneAppearance'/></Appearance>
                <Cylinder radius='0.035' height='0.34'/>
              </Shape>
            </Transform>
            <Transform translation='-0.48 -0.05 0'>
              <Shape>
                <Appearance><Appearance USE='BoneAppearance'/></Appearance>
                <Box size='0.08 0.12 0.04'/>
              </Shape>
            </Transform>
          </Transform>
        </Transform> <!-- END LeftArm -->

      </Transform> <!-- END SpineFlexionJoint -->


      <!-- ================= RIGHT LEG ASSEMBLY ================= -->
      <Transform DEF='RightHipJoint' center='0.22 -0.22 0' translation='0 0 0'>
        
        <!-- GLUTEUS MAXIMUS MUSCLE BELLY -->
        <Transform DEF='GluteusBellyTransform' translation='0.22 -0.26 -0.12' scale='1 1 1'>
          <Shape>
            <Appearance>
              <Material DEF='GluteusMaterial' diffuseColor='0.80 0.24 0.22' shininess='0.4'/>
            </Appearance>
            <Sphere radius='0.16'/>
          </Shape>
        </Transform>

        <!-- FEMUR (THIGH BONE) -->
        <Transform translation='0.22 -0.44 0'>
          <Shape>
            <Appearance><Appearance USE='BoneAppearance'/></Appearance>
            <Cylinder radius='0.05' height='0.42'/>
          </Shape>
        </Transform>

        <!-- QUADRICEPS FEMORIS (ANTERIOR THIGH) -->
        <Transform DEF='QuadricepsBellyTransform' translation='0.22 -0.42 0.07' scale='1 1 1'>
          <Shape>
            <Appearance>
              <Material DEF='QuadricepsMaterial' diffuseColor='0.82 0.22 0.22' shininess='0.5'/>
            </Appearance>
            <Cylinder radius='0.09' height='0.34'/>
          </Shape>
        </Transform>

        <!-- HAMSTRINGS (POSTERIOR THIGH) -->
        <Transform DEF='HamstringsBellyTransform' translation='0.22 -0.44 -0.07' scale='1 1 1'>
          <Shape>
            <Appearance>
              <Material DEF='HamstringsMaterial' diffuseColor='0.74 0.22 0.22' shininess='0.4'/>
            </Appearance>
            <Cylinder radius='0.08' height='0.34'/>
          </Shape>
        </Transform>

        <!-- RIGHT KNEE JOINT (Pivot at 0.22, -0.66, 0) -->
        <Transform DEF='RightKneeJoint' center='0.22 -0.66 0' translation='0 0 0'>
          
          <!-- KNEE JOINT / PATELLA -->
          <Transform translation='0.22 -0.66 0.04'>
            <Shape>
              <Appearance><Appearance USE='BoneAppearance'/></Appearance>
              <Sphere radius='0.055'/>
            </Shape>
          </Transform>

          <!-- TIBIA & FIBULA (LOWER LEG BONES) -->
          <Transform translation='0.22 -0.90 0'>
            <Shape>
              <Appearance><Appearance USE='BoneAppearance'/></Appearance>
              <Cylinder radius='0.045' height='0.45'/>
            </Shape>
          </Transform>

          <!-- GASTROCNEMIUS (CALF) MUSCLE BELLY -->
          <Transform DEF='GastrocnemiusBellyTransform' translation='0.22 -0.82 -0.06' scale='1 1 1'>
            <Shape>
              <Appearance>
                <Material DEF='GastrocnemiusMaterial' diffuseColor='0.78 0.22 0.22' shininess='0.4'/>
              </Appearance>
              <Cylinder radius='0.07' height='0.28'/>
            </Shape>
          </Transform>

          <!-- RIGHT ANKLE JOINT (Pivot at 0.22, -1.14, 0) -->
          <Transform DEF='RightAnkleJoint' center='0.22 -1.14 0' translation='0 0 0'>
            
            <!-- ANKLE SPHERE -->
            <Transform translation='0.22 -1.14 0'>
              <Shape>
                <Appearance><Appearance USE='BoneAppearance'/></Appearance>
                <Sphere radius='0.05'/>
              </Shape>
            </Transform>

            <!-- FOOT BONE -->
            <Transform translation='0.22 -1.18 0.12'>
              <Shape>
                <Appearance><Appearance USE='BoneAppearance'/></Appearance>
                <Box size='0.10 0.06 0.26'/>
              </Shape>
            </Transform>

          </Transform> <!-- END RightAnkleJoint -->
        </Transform> <!-- END RightKneeJoint -->
      </Transform> <!-- END RightHipJoint -->


      <!-- ================= LEFT LEG ASSEMBLY ================= -->
      <Transform DEF='LeftHipJoint' center='-0.22 -0.22 0' translation='0 0 0'>
        <Transform translation='-0.22 -0.44 0'>
          <Shape>
            <Appearance><Appearance USE='BoneAppearance'/></Appearance>
            <Cylinder radius='0.05' height='0.42'/>
          </Shape>
        </Transform>
        <Transform translation='-0.22 -0.42 0.07'>
          <Shape>
            <Appearance>
              <Material diffuseColor='0.75 0.22 0.22'/>
            </Appearance>
            <Cylinder radius='0.085' height='0.34'/>
          </Shape>
        </Transform>

        <Transform DEF='LeftKneeJoint' center='-0.22 -0.66 0' translation='0 0 0'>
          <Transform translation='-0.22 -0.90 0'>
            <Shape>
              <Appearance><Appearance USE='BoneAppearance'/></Appearance>
              <Cylinder radius='0.045' height='0.45'/>
            </Shape>
          </Transform>

          <Transform DEF='LeftAnkleJoint' center='-0.22 -1.14 0' translation='0 0 0'>
            <Transform translation='-0.22 -1.18 0.12'>
              <Shape>
                <Appearance><Appearance USE='BoneAppearance'/></Appearance>
                <Box size='0.10 0.06 0.26'/>
              </Shape>
            </Transform>
          </Transform>
        </Transform>
      </Transform> <!-- END LeftLeg -->

    </Transform> <!-- END Root -->
  </Scene>
</X3D>`;
}
